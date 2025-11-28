import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

import 'package:patient/constants/colors.dart';
import 'package:patient/provider/memory_provider.dart';
import 'package:patient/services/gemini_api.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final FlutterTts flutterTts = FlutterTts();
  final stt.SpeechToText speech = stt.SpeechToText();

  // Conversation State
  bool _isConversationActive = false;
  String _statusText = "Press Start";
  String _currentRecognizedText = "";

  // This completer acts as the bridge between the event listener and the loop
  Completer<String>? _listeningCompleter;

  @override
  void initState() {
    super.initState();
    _initTts();
    _initSpeech();
  }

  // 1. SETUP TTS
  Future<void> _initTts() async {
    await flutterTts.awaitSpeakCompletion(true); // Wait for speech to finish
    await flutterTts.setPitch(1.0);
    await flutterTts.setSpeechRate(0.4);
    await flutterTts.setVolume(1.0);
  }

  // 2. SETUP SPEECH (Initialize ONCE with status listener)
  Future<void> _initSpeech() async {
    try {
      await speech.initialize(
        onStatus: _onSpeechStatus, // <--- THIS IS KEY
        onError: (val) => print('onError: $val'),
      );
    } catch (e) {
      print("Speech initialization error: $e");
    }
  }

  // 3. GLOBAL STATUS LISTENER
  // This function runs automatically when the mic turns on/off
  void _onSpeechStatus(String status) {
    print("STT Status: $status"); // Check console to see 'listening' -> 'done'

    // 'done' (Android) or 'notListening' (iOS) means silence was detected
    if (status == 'done' || status == 'notListening') {
      if (_listeningCompleter != null && !_listeningCompleter!.isCompleted) {
        _listeningCompleter!.complete(_currentRecognizedText);
      }
    }
  }

  @override
  void dispose() {
    flutterTts.stop();
    speech.stop();
    super.dispose();
  }

  // ---------------------------------------------------------
  // CORE CONVERSATION LOOP
  // ---------------------------------------------------------

  Future<void> _startConversationLoop(Map memory) async {
    setState(() => _isConversationActive = true);

    // Initial Question
    await _aiSpeak("Can you tell me what you remember about this moment?");

    while (_isConversationActive) {
      if (!mounted) break;

      // --- LISTEN ---
      // This line will PAUSE execution until the user stops talking
      String userReply = await _listenToUser();

      if (!_isConversationActive) break;

      // --- VALIDATE ---
      if (userReply.trim().isEmpty) {
        await _aiSpeak("I didn't hear you. Please try again.");
        continue;
      }

      // --- THINK ---
      setState(() => _statusText = "Thinking...");
      String aiResponse = await _askGemini(memory, userReply);
      print(aiResponse);

      // --- SPEAK ---
      await _aiSpeak(aiResponse);

      // Short pause before next turn
      await Future.delayed(const Duration(seconds: 1));
    }
  }

  /// Starts listening and returns a Future that completes when silence is detected
  Future<String> _listenToUser() async {
    // 1. Reset state
    _listeningCompleter = Completer<String>();
    setState(() {
      _currentRecognizedText = "";
      _statusText = "Listening...";
    });

    // 2. Start listening (Status updates handled by _onSpeechStatus)
    await speech.listen(
      onResult: (val) {
        setState(() {
          _currentRecognizedText = val.recognizedWords;
        });
      },
      listenMode: stt.ListenMode.dictation,
      pauseFor: const Duration(seconds: 4),
      partialResults: true,
      cancelOnError: true,
    );

    return _listeningCompleter!.future;
  }

  Future<void> _aiSpeak(String text) async {
    if (!_isConversationActive) return;
    setState(() => _statusText = "AI Speaking...");
    await flutterTts.speak(text);
  }

  void _stopConversation() {
    setState(() {
      _isConversationActive = false;
      _statusText = "Conversation Stopped";
    });
    speech.stop();
    flutterTts.stop();

    // Force complete the future if it's stuck waiting
    if (_listeningCompleter != null && !_listeningCompleter!.isCompleted) {
      _listeningCompleter!.complete("");
    }
  }

  // ---------------------------------------------------------
  // GEMINI API
  // ---------------------------------------------------------

  Future<String> _askGemini(Map memory, String userReply) async {
    final prompt =
        """
        You are a compassionate, supportive therapist guiding a reminiscence-therapy conversation.

Memory Context: "${memory['text'] ?? 'A photo memory'}"
The patient said: "$userReply"

Respond in **one warm, gentle, emotionally attuned sentence**.

Tone: calm, slow, comforting, patient.

Your response must:
• Acknowledge and validate their feelings and experience.
• Softly encourage them to share a little more.
• If user tells you something from outside the memory, gently tell him that let's go to the memory inside of this.
• You may gently hint at details from the given memory context, but **only** from information explicitly inside it.
• Stay completely within the boundaries of this memory; do NOT introduce new details, topics, or questions outside of it.
• If the patient wonders whether their memory is correct, respond weather he/she is correct or not.
• Do NOT give medical, clinical, or diagnostic advice.
• Do NOT judge, interpret, or make assumptions.
• Your single sentence should make them feel safe, understood, and invited to keep exploring this specific memory.

Produce exactly **one** caring sentence.

        """;

    try {
      final response = await GeminiAPI.askGemini(prompt);
      print(response);
      return response ?? "That sounds wonderful. Tell me more.";
    } catch (e) {
      return "I am listening, please go on.";
    }
  }

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    final memoryProvider = Provider.of<MemoryProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        surfaceTintColor: AppColors.white,
        title: Text(
          "Chat with Memories",
          style: GoogleFonts.barlow(color: Colors.black),
        ),
        backgroundColor: Colors.white,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: Column(
        children: [
          Expanded(
            child: Center(
              child: memoryProvider.loading
                  ? const CircularProgressIndicator()
                  : memoryProvider.randomMemory != null
                  ? _buildMemoryView(memoryProvider.randomMemory!)
                  : Text(
                      "Tap 'Start' to load a memory.",
                      style: GoogleFonts.barlow(fontSize: 16),
                    ),
            ),
          ),

          // --- LIVE STATUS ---
          Container(
            padding: const EdgeInsets.all(16),
            width: double.infinity,
            color: Colors.white,
            child: Column(
              children: [
                Text(
                  _statusText,
                  style: GoogleFonts.barlow(
                    fontWeight: FontWeight.bold,
                    color: _isConversationActive
                        ? AppColors.primary
                        : Colors.grey,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  _currentRecognizedText.isEmpty
                      ? "..."
                      : _currentRecognizedText,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.barlow(
                    fontSize: 18,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
          ),

          // --- CONTROLS ---
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: GestureDetector(
              onTap: () async {
                if (_isConversationActive) {
                  _stopConversation();
                  memoryProvider.clearRandomMemory();
                } else {
                  final prefs = await SharedPreferences.getInstance();
                  final id = prefs.getString("id");
                  if (id != null) {
                    await memoryProvider.fetchRandomMemory(id);
                    if (memoryProvider.randomMemory != null) {
                      _startConversationLoop(memoryProvider.randomMemory!);
                    }
                  }
                }
              },
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 26,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: _isConversationActive
                      ? Colors.redAccent
                      : AppColors.primary,
                  borderRadius: BorderRadius.circular(50),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _isConversationActive ? Icons.stop : Icons.play_arrow,
                      color: Colors.white,
                    ),
                    const SizedBox(width: 10),
                    Text(
                      _isConversationActive ? "Stop" : "Start Conversation",
                      style: GoogleFonts.barlow(
                        fontSize: 18,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMemoryView(Map memory) {
    List images = memory['images'] ?? [];
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (images.isNotEmpty)
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(12),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              itemCount: images.length,
              itemBuilder: (context, index) {
                return ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(images[index], fit: BoxFit.cover),
                );
              },
            ),
          ),
      ],
    );
  }
}
