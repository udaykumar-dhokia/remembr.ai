import 'package:flutter/material.dart';
import 'package:patient/services/auth_services.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();

  Map<String, dynamic>? _user;
  bool _loading = false;

  Map<String, dynamic>? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get loading => _loading;

  Future<void> login(String email, String password) async {
    _loading = true;
    notifyListeners();
    try {
      final data = await _authService.loginPatient(
        email: email,
        password: password,
      );
      _user = data['patient'];
    } catch (e) {
      rethrow;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> persist() async {
    _loading = true;
    notifyListeners();
    try {
      final data = await _authService.persistPatient();
      _user = data;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    notifyListeners();
  }
}
