import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:patient/constants/colors.dart';
import 'package:patient/services/auth_services.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String? _name;
  String? _email;
  String? _doctor;
  String? _id;
  bool _loading = true;

  final AuthService _authService = AuthService();

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  Future<void> _fetchProfile() async {
    setState(() => _loading = true);

    try {
      final data = await _authService.persistPatient();

      if (data != null) {
        setState(() {
          _name = data["name"];
          _email = data["email"];
          _doctor = data["doctor"];
          _id = data["_id"];
        });

        // 2️⃣ Save to SharedPreferences for offline fallback
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString("name", _name ?? "");
        await prefs.setString("email", _email ?? "");
        await prefs.setString("doctor", _doctor ?? "");
        await prefs.setString("id", _id ?? "");
      } else {
        // 3️⃣ If API fails, load cached data
        final prefs = await SharedPreferences.getInstance();
        setState(() {
          _name = prefs.getString("name");
          _email = prefs.getString("email");
          _doctor = prefs.getString("doctor");
          _id = prefs.getString("id");
        });
      }
    } catch (e) {
      print("Error fetching profile: $e");
      final prefs = await SharedPreferences.getInstance();
      setState(() {
        _name = prefs.getString("name");
        _email = prefs.getString("email");
        _doctor = prefs.getString("doctor");
        _id = prefs.getString("id");
      });
    }

    setState(() => _loading = false);
  }

  Future<void> _logout() async {
    await _authService.logout();
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Logged out successfully"),
        backgroundColor: Colors.green,
      ),
    );

    Navigator.pushReplacementNamed(context, "/");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        title: Text(
          "Profile",
          style: GoogleFonts.barlow(color: Colors.black87),
        ),
        backgroundColor: Colors.white,
        iconTheme: const IconThemeData(color: Colors.black),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _fetchProfile),
        ],
      ),
      body: _loading
          ? const Center(child: CupertinoActivityIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // --- Avatar ---
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: AppColors.primary.withOpacity(0.1),
                    child: HugeIcon(
                      icon: HugeIcons.strokeRoundedUser03,
                      size: 50,
                      color: AppColors.grey,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // --- Name ---
                  Text(
                    _name ?? "Patient",
                    style: GoogleFonts.barlow(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // --- Email ---
                  Text(
                    _email ?? "email@example.com",
                    style: GoogleFonts.barlow(
                      fontSize: 16,
                      color: Colors.grey[700],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // --- Info Card ---
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.grey[50],
                      borderRadius: BorderRadius.circular(15),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.2),
                          blurRadius: 3,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildInfoRow("Patient ID", _id ?? "N/A"),
                        const Divider(height: 24),
                        _buildInfoRow("Doctor Assigned", _doctor ?? "N/A"),
                        const Divider(height: 24),
                        _buildInfoRow("Email", _email ?? "N/A"),
                        const Divider(height: 24),
                        _buildInfoRow("App Version", "v1.0.0"),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),

                  // --- Logout Button ---
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton.icon(
                      icon: HugeIcon(
                        icon: HugeIcons.strokeRoundedLogout05,
                        size: 18,
                        color: AppColors.white,
                      ),
                      label: Text(
                        "Logout",
                        style: GoogleFonts.barlow(
                          fontSize: 16,
                          color: Colors.white,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50),
                        ),
                      ),
                      onPressed: _logout,
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildInfoRow(String title, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: GoogleFonts.barlow(fontSize: 12, color: Colors.grey[700]),
        ),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: GoogleFonts.barlow(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
        ),
      ],
    );
  }
}
