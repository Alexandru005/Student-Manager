package com.alexstefan.backend.service;

import com.alexstefan.backend.model.Task;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    Task addTask(Task newTask);
    List<Task> showAllTasks();
    Optional<Task> showTaskById(Long id);
    Task updateTask(Task updatedTask, Long idOldTask);
    void deleteTask(Long idTask);
}
