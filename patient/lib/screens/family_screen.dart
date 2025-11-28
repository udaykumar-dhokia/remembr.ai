import 'dart:math';
import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:flutter_tts/flutter_tts.dart";
import "package:shimmer/shimmer.dart";
import "package:patient/constants/colors.dart";

class FamilyScreen extends StatefulWidget {
  const FamilyScreen({super.key});

  @override
  State<FamilyScreen> createState() => _FamilyScreenState();
}

class _FamilyScreenState extends State<FamilyScreen>
    with SingleTickerProviderStateMixin {
  final GlobalKey _imageKey = GlobalKey();
  Offset? _tapPosition;
  bool gameActive = false;

  final FlutterTts tts = FlutterTts();

  bool ttsReady = false;
  bool imageLoaded = false;

  late AnimationController fadeController;
  late Animation<double> fadeAnimation;

  final List<String> names = [
    "Shivam",
    "Udaykumar",
    "Neel",
    "Jay",
    "Deep",
    "Soham",
  ];

  late Map<String, Rect> boundingBoxes;
  late String targetName;
  String message = "";

  final List<Map<String, dynamic>> guessHistory = [];

  @override
  void initState() {
    super.initState();

    fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    fadeAnimation = CurvedAnimation(
      parent: fadeController,
      curve: Curves.easeIn,
    );

    _createBoundingBoxes();
    _pickRandomTarget();

    _initTTS();
  }

  Future<void> _initTTS() async {
    setState(() => ttsReady = true);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _announce("Can you guess who is $targetName?");
    });
  }

  Future _announce(String text) async {
    if (!ttsReady || !gameActive) return;

    await tts.speak(text);

    setState(() => message = text);
    fadeController.forward(from: 0);
  }

  void _createBoundingBoxes() {
    boundingBoxes = {
      names[0]: Rect.fromLTWH(0.02, 0.10, 0.16, 0.80), // Person 1
      names[1]: Rect.fromLTWH(0.18, 0.10, 0.16, 0.80), // Person 2
      names[2]: Rect.fromLTWH(0.34, 0.10, 0.16, 0.80), // Person 3
      names[3]: Rect.fromLTWH(0.50, 0.10, 0.16, 0.80), // Person 4
      names[4]: Rect.fromLTWH(0.66, 0.10, 0.16, 0.80), // Person 5
      names[5]: Rect.fromLTWH(0.82, 0.10, 0.16, 0.80), // Person 6
    };
  }

  void _pickRandomTarget() {
    targetName = names[Random().nextInt(names.length)];
  }

  void _onTapDown(TapDownDetails details) {
    if (!gameActive) return;
    final RenderBox box =
        _imageKey.currentContext!.findRenderObject() as RenderBox;
    final Size widgetSize = box.size;
    final Offset localPos = details.localPosition;

    final double relativeX = localPos.dx / widgetSize.width;
    final double relativeY = localPos.dy / widgetSize.height;

    setState(() => _tapPosition = localPos);

    _checkGuess(relativeX, relativeY);
  }

  void _addGuess(String name, bool correct) {
    guessHistory.insert(0, {
      "name": name,
      "correct": correct,
      "time": DateTime.now(),
    });
    setState(() {});
  }

  void _checkGuess(double x, double y) {
    for (var entry in boundingBoxes.entries) {
      final name = entry.key;
      final rect = entry.value;

      if (rect.contains(Offset(x, y))) {
        if (name == targetName) {
          _addGuess(name, true);
          _announce("You guessed it right!");
          _newRound();
        } else {
          _addGuess(name, false);
          _announce("Wrong guess, try again.");
        }
        return;
      }
    }

    _addGuess("No person", false);
    _announce("That’s not a person. Try again.");
  }

  void _newRound() {
    Future.delayed(const Duration(seconds: 2), () {
      if (!gameActive) return;

      setState(() {
        _tapPosition = null;
        _pickRandomTarget();
      });
      _announce("Can you guess who is $targetName?");
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        surfaceTintColor: AppColors.white,
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text("Guess the Person", style: GoogleFonts.barlow()),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: ElevatedButton(
          onPressed: () async {
            if (gameActive) {
              setState(() {
                gameActive = false;
                message = "Game stopped.";
                _tapPosition = null;
              });
              tts.stop();
            } else {
              setState(() {
                gameActive = true;
                guessHistory.clear();
              });
              _pickRandomTarget();
              await Future.delayed(Duration(milliseconds: 200));
              _announce("Can you guess who is $targetName?");
            }
          },
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 4),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
            elevation: 6,
            backgroundColor: gameActive
                ? const Color.fromARGB(255, 176, 38, 36)
                : AppColors.primary,
            shadowColor: Colors.black26,
          ),
          child: Text(
            gameActive ? "Stop" : "Start",
            style: GoogleFonts.barlow(fontSize: 16, color: Colors.white),
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            Expanded(
              flex: 4,
              child: Center(
                child: GestureDetector(
                  onTapDown: _onTapDown,
                  child: Stack(
                    children: [
                      if (!imageLoaded)
                        Shimmer.fromColors(
                          baseColor: Colors.grey.shade300,
                          highlightColor: Colors.grey.shade100,
                          child: Container(
                            width: 320,
                            height: 200,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade300,
                              borderRadius: BorderRadius.circular(18),
                            ),
                          ),
                        ),

                      Opacity(
                        opacity: imageLoaded ? 1 : 0,
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(18),
                          child: Image.asset(
                            'lib/assets/demo.jpeg',
                            key: _imageKey,
                            fit: BoxFit.contain,
                            frameBuilder: (context, child, frame, wasSync) {
                              if (frame != null && !imageLoaded) {
                                Future.microtask(() {
                                  setState(() => imageLoaded = true);
                                });
                              }
                              return child;
                            },
                          ),
                        ),
                      ),

                      if (_tapPosition != null)
                        Positioned(
                          left: _tapPosition!.dx - 6,
                          top: _tapPosition!.dy - 6,
                          child: Container(
                            width: 14,
                            height: 14,
                            decoration: BoxDecoration(
                              color: Colors.red,
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),

            /// SPOKEN TEXT IN MIDDLE
            FadeTransition(
              opacity: fadeAnimation,
              child: Container(
                margin: const EdgeInsets.only(bottom: 20),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Text(
                  message,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.barlow(fontSize: 20),
                ),
              ),
            ),

            /// GUESS HISTORY AT BOTTOM
            Expanded(
              flex: 3,
              child: Container(
                child: Column(
                  children: [
                    Text(
                      "Previous Guesses",
                      style: GoogleFonts.barlow(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),

                    Expanded(
                      child: guessHistory.isEmpty
                          ? Center(
                              child: Text(
                                "No guesses yet",
                                style: GoogleFonts.barlow(
                                  fontSize: 16,
                                  color: Colors.grey,
                                ),
                              ),
                            )
                          : ListView.builder(
                              physics: BouncingScrollPhysics(),
                              itemCount: guessHistory.length,
                              itemBuilder: (context, index) {
                                final guess = guessHistory[index];
                                final correct = guess["correct"] as bool;

                                return Container(
                                  margin: const EdgeInsets.symmetric(
                                    vertical: 6,
                                  ),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: correct
                                        ? Colors.green.shade100
                                        : Colors.red.shade100,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        guess["name"],
                                        style: GoogleFonts.barlow(fontSize: 18),
                                      ),
                                      Text(
                                        correct ? "✔ Correct" : "✘ Wrong",
                                        style: TextStyle(
                                          color: correct
                                              ? Colors.green.shade700
                                              : Colors.red.shade700,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
