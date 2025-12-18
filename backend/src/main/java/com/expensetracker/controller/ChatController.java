package com.expensetracker.controller;

import com.expensetracker.dto.ChatRequestDTO;
import com.expensetracker.dto.ChatResponseDTO;
import com.expensetracker.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponseDTO> processMessage(@RequestBody ChatRequestDTO request) {
        ChatResponseDTO response = chatService.processMessage(request.getMessage());
        return ResponseEntity.ok(response);
    }
}

