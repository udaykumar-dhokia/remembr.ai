import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:patient/constants/colors.dart';
import 'package:patient/screens/chat_screen.dart';
import 'package:patient/screens/family_screen.dart';
import 'package:patient/screens/home_screen.dart';
import 'package:patient/screens/memory_screen.dart';
import 'package:patient/screens/profile_screen.dart';

class BottomBar extends StatefulWidget {
  const BottomBar({super.key});

  @override
  State<BottomBar> createState() => _BottomBarState();
}

class _BottomBarState extends State<BottomBar> {
  int _selectedIndex = 0;

  final List<Widget> _tabs = const [
    HomeScreen(),
    ChatScreen(),
    FamilyScreen(),
    MemoryScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: _tabs[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(blurRadius: 8, color: Colors.black.withOpacity(0.1)),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10),
            child: GNav(
              textStyle: GoogleFonts.barlow(color: AppColors.white),
              gap: 8,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              activeColor: Colors.white,
              color: Colors.black54,
              backgroundColor: Colors.white,
              tabBackgroundColor: AppColors.primary,
              tabBorderRadius: 50,
              selectedIndex: _selectedIndex,
              onTabChange: (index) {
                setState(() => _selectedIndex = index);
              },
              tabs: [
                GButton(
                  icon: const IconData(4),
                  leading: HugeIcon(
                    icon: HugeIcons.strokeRoundedChatting01,
                    size: 18,
                    color: _selectedIndex == 0 ? Colors.white : Colors.black54,
                  ),
                  text: 'Home',
                ),
                GButton(
                  icon: const IconData(4),
                  leading: HugeIcon(
                    icon: HugeIcons.strokeRoundedChatBot,
                    size: 18,
                    color: _selectedIndex == 1 ? Colors.white : Colors.black54,
                  ),
                  text: 'Chat',
                ),
                GButton(
                  icon: const IconData(4),
                  leading: HugeIcon(
                    icon: HugeIcons.strokeRoundedUserGroup,
                    size: 18,
                    color: _selectedIndex == 2 ? Colors.white : Colors.black54,
                  ),
                  text: 'Family',
                ),
                GButton(
                  icon: const IconData(4),
                  leading: HugeIcon(
                    icon: HugeIcons.strokeRoundedBrain02,
                    size: 18,
                    color: _selectedIndex == 3 ? Colors.white : Colors.black54,
                  ),
                  text: 'Memories',
                ),
                GButton(
                  icon: const IconData(4),
                  leading: HugeIcon(
                    icon: HugeIcons.strokeRoundedUser,
                    size: 18,
                    color: _selectedIndex == 4 ? Colors.white : Colors.black54,
                  ),
                  text: 'Profile',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
