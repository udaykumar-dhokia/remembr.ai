import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final String baseUrl;

  AuthService({required this.baseUrl});

  /// Save token in shared preferences
  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  /// Get token from shared preferences
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  /// Remove token from shared preferences
  Future<void> _removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }

  /// Register a patient
  Future<Map<String, dynamic>> registerPatient({
    required String name,
    required String email,
    required String password,
    required String doctor,
  }) async {
    final url = Uri.parse('$baseUrl/auth/registerPatient');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'doctor': doctor,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return data;
    } else {
      throw Exception(data['message'] ?? 'Registration failed');
    }
  }

  /// Login a patient
  Future<Map<String, dynamic>> loginPatient({
    required String email,
    required String password,
  }) async {
    final url = Uri.parse('$baseUrl/auth/patient/login');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      final prefs = await SharedPreferences.getInstance();
      await _saveToken(data['token']);
      await prefs.setString('id', data["patient"]["_id"]);
      await prefs.setString("email", data["patient"]["email"]);
      await prefs.setString("name", data["patient"]["name"]);
      return data;
    } else {
      throw Exception(data['message'] ?? 'Login failed');
    }
  }

  /// Persist logged-in patient (get user from token)
  Future<Map<String, dynamic>?> persistPatient() async {
    final token = await _getToken();
    print(token);
    if (token == null) return null;

    final url = Uri.parse('$baseUrl/auth/patient/persist');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return data['user'];
    } else {
      return null;
    }
  }

  /// Logout patient
  Future<void> logout() async {
    await _removeToken();
  }
}
