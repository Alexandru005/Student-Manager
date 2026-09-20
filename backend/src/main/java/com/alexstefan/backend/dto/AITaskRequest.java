package com.alexstefan.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AITaskRequest(@NotBlank(message = "Prompt-ul nu poate fi gol!") String userPrompt) {
}
