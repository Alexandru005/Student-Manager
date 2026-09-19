package com.alexstefan.backend.service;

import com.alexstefan.backend.model.Task;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    Task addTask(Task newTask);
    List<Task> showAllTasks();
    Optional<Task> showTaskById(Long id);
    List<Task> showFilteredTasks(String status, String category, LocalDateTime dueTimeMin, LocalDateTime dueTimeMax);
    Task updateTask(Task updatedTask, Long idOldTask);
    void deleteTask(Long idTask);
}
