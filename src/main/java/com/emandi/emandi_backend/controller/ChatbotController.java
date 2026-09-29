package com.emandi.emandi_backend.controller;
import com.emandi.emandi_backend.dto.ChatRequest;
import com.emandi.emandi_backend.dto.ChatResponse;
import com.emandi.emandi_backend.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class ChatbotController {
    @Autowired private ChatbotService chatbotService;
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String response = chatbotService.getChatResponse(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(response));
    }
}
