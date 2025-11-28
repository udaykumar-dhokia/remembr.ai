import 'dart:convert';
import 'package:http/http.dart' as http;

class GeminiAPI {
  static const String apiKey = "AIzaSyC0BNoA0wt3tjsxZE9aNRPMUDiuxj_rABw";

  static Future<String?> askGemini(String prompt) async {
    final url = Uri.parse(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey",
    );

    final body = {
      "contents": [
        {
          "parts": [
            {"text": prompt},
          ],
        },
      ],
    };

    try {
      final res = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(body),
      );

      final json = jsonDecode(res.body);

      if (json["candidates"] != null &&
          json["candidates"].length > 0 &&
          json["candidates"][0]["content"] != null &&
          json["candidates"][0]["content"]["parts"] != null) {
        return json["candidates"][0]["content"]["parts"][0]["text"];
      }
      return null;
    } catch (e) {
      print("Gemini Error $e");
      return null;
    }
  }
}
