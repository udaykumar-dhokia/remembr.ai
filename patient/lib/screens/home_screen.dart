import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:http/http.dart' as http;
import 'package:patient/constants/colors.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _controller = TextEditingController();
  final FlutterTts _flutterTts = FlutterTts();
  late stt.SpeechToText _speech;
  final ScrollController _scrollController = ScrollController();

  bool _isListening = false;
  bool _isLoading = false;

  final List<Map<String, String>> _messages = [];
  final String? baseUrl = dotenv.env["BACKEND_URL"];

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
    _loadChats();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _listen() async {
    if (!_isListening) {
      bool available = await _speech.initialize(
        onStatus: (val) => debugPrint('onStatus: $val'),
        onError: (val) => debugPrint('onError: $val'),
      );
      if (available) {
        setState(() => _isListening = true);
        _speech.listen(
          onResult: (val) {
            setState(() {
              _controller.text = val.recognizedWords;
            });
          },
        );
      }
    } else {
      setState(() => _isListening = false);
      _speech.stop();
    }
  }

  Future<void> _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({"role": "user", "text": text});
      _isLoading = true;
    });
    _controller.clear();

    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = await prefs.getString("id");
      final url = Uri.parse("$baseUrl/normal-chat/send");

      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"content": text, "userId": userId}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final reply = data["reply"] ?? "No response received.";

        setState(() {
          _messages.add({"role": "model", "text": reply});
        });
        _scrollToBottom();

        await _flutterTts.speak(reply);
      } else {
        setState(() {
          _messages.add({
            "role": "error",
            "text": "Error: ${response.statusCode} - ${response.reasonPhrase}",
          });
        });
      }
    } catch (e) {
      debugPrint("Error sending message: $e");
      setState(() {
        _messages.add({"role": "error", "text": "Failed to send message."});
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _loadChats() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString("id");
      if (userId == null) return;

      final url = Uri.parse("$baseUrl/normal-chat/user/$userId");
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        final List<dynamic> messages = data["messages"] ?? [];

        setState(() {
          _messages.clear();
          _messages.addAll(
            messages.map(
              (m) => {
                "role": m["role"] == "assistant" ? "model" : "user",
                "text": m["content"] ?? "",
              },
            ),
          );
        });

        _scrollToBottom();
      } else {
        debugPrint("Failed to load chats: ${response.statusCode}");
      }
    } catch (e) {
      debugPrint("Error loading chats: $e");
    }
  }

  Widget _buildMessageBubble(Map<String, String> msg) {
    final width = MediaQuery.sizeOf(context).width;

    final isUser = msg["role"] == "user";
    final isError = msg["role"] == "error";

    Color? bgColor;
    if (isError) {
      bgColor = Colors.red[100];
    } else if (isUser) {
      bgColor = AppColors.grey.withAlpha(19);
    } else {
      bgColor = AppColors.primary.withAlpha(30);
    }

    return Row(
      mainAxisAlignment: isUser
          ? MainAxisAlignment.end
          : MainAxisAlignment.start,
      children: [
        Container(
          constraints: BoxConstraints(maxWidth: width * 0.8),
          margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.only(
              topLeft: const Radius.circular(12),
              topRight: const Radius.circular(12),
              bottomLeft: isUser ? const Radius.circular(12) : Radius.zero,
              bottomRight: isUser ? Radius.zero : const Radius.circular(12),
            ),
          ),
          child: Text(
            msg["text"] ?? "",
            style: GoogleFonts.barlow(fontSize: 14, color: Colors.black),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        surfaceTintColor: AppColors.white,
        title: Text("Personal Assistant", style: GoogleFonts.barlow()),
        backgroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Expanded(
            child: RefreshIndicator(
              onRefresh: _loadChats,
              child: _messages.isEmpty
                  ? Center(
                      child: Text(
                        "Start chatting...",
                        style: GoogleFonts.barlow(
                          fontSize: 18,
                          color: Colors.grey,
                        ),
                      ),
                    )
                  : ListView.builder(
                      controller: _scrollController,
                      physics: BouncingScrollPhysics(),
                      reverse: false,
                      itemCount: _messages.length,
                      itemBuilder: (context, index) {
                        return _buildMessageBubble(_messages[index]);
                      },
                    ),
            ),
          ),

          if (_isLoading)
            Padding(
              padding: EdgeInsets.all(8.0),
              child: CupertinoActivityIndicator(),
            ),

          Container(
            margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            padding: const EdgeInsets.symmetric(horizontal: 8),
            decoration: BoxDecoration(
              color: Colors.transparent,
              borderRadius: BorderRadius.circular(50),
              border: Border.all(color: AppColors.grey),
            ),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(
                    _isListening ? Icons.mic : Icons.mic_none,
                    color: Colors.grey[700],
                  ),
                  onPressed: _listen,
                ),

                Expanded(
                  child: TextFormField(
                    cursorColor: AppColors.grey,
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: "Type a message",
                      hintStyle: GoogleFonts.barlow(color: Colors.grey),
                      border: InputBorder.none,
                    ),
                  ),
                ),

                IconButton(
                  icon: HugeIcon(icon: HugeIcons.strokeRoundedTelegram),
                  onPressed: _isLoading ? null : _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
