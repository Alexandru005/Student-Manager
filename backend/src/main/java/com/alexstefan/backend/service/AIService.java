package com.alexstefan.backend.service;

import com.alexstefan.backend.dto.AITaskRequest;
import com.alexstefan.backend.dto.AITaskResponse;

public interface AIService {
    AITaskResponse generatedText(AITaskRequest userInfo);
}
