package com.alexstefan.backend.controller;

import com.alexstefan.backend.dto.AITaskRequest;
import com.alexstefan.backend.dto.AITaskResponse;
import com.alexstefan.backend.service.AIService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:5173") // OBLIGATORIU: Permite frontend-ului (Vite/React) să acceseze API-ul
public class AIController {
    private final AIService aiService;

    public AIController(AIService aiService){
        this.aiService = aiService;
    }

    @PostMapping("/get-response")
    public AITaskResponse generatedText(@Valid @RequestBody AITaskRequest userInfo){
        return aiService.generatedText(userInfo);
    }
}
