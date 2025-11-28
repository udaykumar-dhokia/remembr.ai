import 'dart:async';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:patient/constants/colors.dart';
import 'package:patient/widgets/bottom_bar.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  final FlutterTts _flutterTts = FlutterTts();
  String greeting = "";

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      precacheImage(const AssetImage("lib/assets/back.jpg"), context);
    });

    _printAvailableVoices(); // 👈 Print voices in console
    _setGreeting();
  }

  // Print available voices to console
  void _printAvailableVoices() async {
    List<dynamic> voices = await _flutterTts.getVoices;
    print("Available Voices:");
    for (var voice in voices) {
      print(voice);
    }
  }

  // Greeting based on time
  void _setGreeting() async {
    final hour = DateTime.now().hour;

    if (hour >= 5 && hour < 12) {
      greeting = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    setState(() {});
    await _speak("Hey, $greeting, welcome back.");

    Timer(const Duration(seconds: 3), _navigateToNextPage);
  }

  // Speak with custom voice
  Future<void> _speak(String text) async {
    await _flutterTts.setLanguage("hi-IN");
    await _flutterTts.setPitch(1.0);
    await _flutterTts.setSpeechRate(0.45);

    await _flutterTts.setVoice({
      "name": "hi-in-x-hid-network",
      "locale": "hi-IN",
    });

    await _flutterTts.speak(text);
  }

  void _navigateToNextPage() {
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const BottomBar()),
    );
  }

  @override
  void dispose() {
    _flutterTts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 40,
                ),
                child: Image.asset("lib/assets/back.jpg", height: 300),
              ),

              Text(
                greeting.isEmpty ? "..." : greeting,
                style: GoogleFonts.barlow(
                  fontSize: 28,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),

              const SizedBox(height: 10),

              Text(
                "Welcome back!",
                style: GoogleFonts.barlow(
                  fontSize: 20,
                  color: Colors.grey[700],
                ),
              ),

              const SizedBox(height: 30),
              CupertinoActivityIndicator(),
            ],
          ),
        ),
      ),
    );
  }
}
