import 'dart:math';
import 'package:flutter/material.dart';
import 'package:patient/services/memory_services.dart';

class MemoryProvider extends ChangeNotifier {
  final MemoryService memoryService;

  MemoryProvider({required this.memoryService});

  List<dynamic> _memories = [];
  Map<String, dynamic>? _randomMemory;
  bool _loading = false;

  List<dynamic> get memories => _memories;
  Map<String, dynamic>? get randomMemory => _randomMemory;
  bool get loading => _loading;

  Future<void> fetchMemories(String patientId) async {
    _loading = true;
    notifyListeners();

    try {
      final result = await memoryService.getMemories(patientId);
      _memories = result;
    } catch (e) {
      _memories = [];
      _randomMemory = null;
      debugPrint("Error fetching memories: $e");
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void clearRandomMemory() {
    _randomMemory = null;
    notifyListeners();
  }

  /// Optionally: fetch only random memory directly
  Future<void> fetchRandomMemory(String patientId) async {
    _loading = true;
    notifyListeners();

    try {
      final result = await memoryService.getMemories(patientId);
      if (result.isNotEmpty) {
        final randomIndex = Random().nextInt(result.length);
        _randomMemory = result[randomIndex];
      } else {
        _randomMemory = null;
      }
    } catch (e) {
      _randomMemory = null;
      debugPrint("Error fetching random memory: $e");
    } finally {
      _loading = false;
      notifyListeners();
    }
  }
}
