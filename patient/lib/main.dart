import "package:flutter/material.dart";
import "package:patient/provider/auth_provider.dart";
import "package:patient/screens/splash_screen.dart";
import "package:patient/widgets/bottom_bar.dart";
import "package:provider/provider.dart";

void main() {
  runApp(
    MultiProvider(
      providers: [ChangeNotifierProvider(create: (_) => AuthProvider())],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: "/",
      routes: {
        "/": (context) => SplashScreen(),
        "/home": (context) => BottomBar(),
      },
    );
  }
}
