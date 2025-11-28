import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:patient/constants/colors.dart';
import 'package:patient/provider/memory_provider.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class MemoryScreen extends StatefulWidget {
  const MemoryScreen({super.key});

  @override
  State<MemoryScreen> createState() => _MemoryScreenState();
}

class _MemoryScreenState extends State<MemoryScreen> {
  @override
  void initState() {
    super.initState();
    _loadPatientId();
  }

  Future<void> _loadPatientId() async {
    final prefs = await SharedPreferences.getInstance();
    final id = prefs.getString("id");

    if (id != null) {
      final provider = Provider.of<MemoryProvider>(context, listen: false);
      if (provider.memories.isEmpty) {
        provider.fetchMemories(id);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        surfaceTintColor: AppColors.white,
        title: Text(
          "Memories",
          style: GoogleFonts.barlow(color: Colors.black87),
        ),
        backgroundColor: Colors.white,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: Consumer<MemoryProvider>(
        builder: (context, provider, child) {
          if (provider.loading) {
            return const Center(child: CupertinoActivityIndicator());
          }

          if (provider.memories.isEmpty) {
            return Center(
              child: Text(
                "No memories found.",
                style: GoogleFonts.barlow(
                  fontSize: 16,
                  color: Colors.grey[700],
                ),
              ),
            );
          }

          return ListView.builder(
            physics: BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            itemCount: provider.memories.length,
            itemBuilder: (context, index) {
              final memory = provider.memories[index];
              final images = memory['images'] as List<dynamic>? ?? [];

              return Card(
                color: AppColors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                margin: const EdgeInsets.only(bottom: 16),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        memory['text'] ?? '',
                        style: GoogleFonts.barlow(
                          fontSize: 14,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (images.isNotEmpty)
                        SizedBox(
                          height: 80,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemCount: images.length > 3 ? 3 : images.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(width: 8),
                            itemBuilder: (context, imgIndex) {
                              return ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Image.network(
                                  images[imgIndex],
                                  width: 80,
                                  height: 80,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) => Container(
                                    width: 80,
                                    height: 80,
                                    color: Colors.grey[300],
                                    child: const Icon(Icons.broken_image),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      if (images.length > 3)
                        Padding(
                          padding: const EdgeInsets.only(top: 8.0),
                          child: Text(
                            "+${images.length - 3} more images",
                            style: GoogleFonts.barlow(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
