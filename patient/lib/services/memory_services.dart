import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class MemoryService {
  static String? baseUrl = dotenv.env["BACKEND_URL"];

  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  /// Get token from shared preferences
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  /// Create a new memory
  Future<Map<String, dynamic>> createMemory({
    required String patientId,
    required String doctorId,
    required String vectorId,
    required String text,
    required List<String> images,
  }) async {
    final token = await _getToken();
    if (token == null) throw Exception("Unauthorized");

    final url = Uri.parse('$baseUrl/memory');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'patient': patientId,
        'doctor': doctorId,
        'vectorId': vectorId,
        'text': text,
        'images': images,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 || response.statusCode == 201) {
      return data;
    } else {
      throw Exception(data['message'] ?? "Failed to create memory");
    }
  }

  /// Get all memories for a patient
  Future<List<dynamic>> getMemories(String patientId) async {
    final token = await _getToken();
    if (token == null) throw Exception("Unauthorized");

    final url = Uri.parse('$baseUrl/memory/patient/$patientId');
    final response = await http.get(url);

    final data = jsonDecode(response.body);
    print(data);
    if (response.statusCode == 200) {
      return data['memories'] ?? [];
    } else {
      throw Exception(data['message'] ?? "Failed to fetch memories");
    }
  }

  /// Get memory by ID
  Future<Map<String, dynamic>> getMemoryById(String memoryId) async {
    final token = await _getToken();
    if (token == null) throw Exception("Unauthorized");

    final url = Uri.parse('$baseUrl/memory/$memoryId');
    final response = await http.get(
      url,
      headers: {'Authorization': 'Bearer $token'},
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return data;
    } else {
      throw Exception(data['message'] ?? "Failed to fetch memory");
    }
  }

  /// Delete a memory
  Future<void> deleteMemory(String memoryId) async {
    final token = await _getToken();
    if (token == null) throw Exception("Unauthorized");

    final url = Uri.parse('$baseUrl/memory/$memoryId');
    final response = await http.delete(
      url,
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode != 200) {
      final data = jsonDecode(response.body);
      throw Exception(data['message'] ?? "Failed to delete memory");
    }
  }
}
