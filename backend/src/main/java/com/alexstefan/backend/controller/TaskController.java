package com.alexstefan.backend.controller;

import com.alexstefan.backend.model.Task;
import com.alexstefan.backend.service.TaskService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:5173") // OBLIGATORIU: Permite frontend-ului (Vite/React) să acceseze API-ul
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // CREATE: POST http://localhost:8080/api/tasks
    @PostMapping
    public Task addTask(@RequestBody Task newTask) {
        return taskService.addTask(newTask);
    }

    // READ ALL: GET http://localhost:8080/api/tasks
    @GetMapping
    public List<Task> showAllTasks() {
        return taskService.showAllTasks();
    }

    // READ ONE: GET http://localhost:8080/api/tasks/{id}
    @GetMapping("/{id}")
    public Optional<Task> showTaskById(@PathVariable Long id) {
        return taskService.showTaskById(id);
    }

    @GetMapping("/filter")
    public List<Task> showFilteredTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dueTimeMin,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dueTimeMax) {

        return taskService.showFilteredTasks(status, category, dueTimeMin, dueTimeMax);
    }

    // UPDATE: PUT http://localhost:8080/api/tasks/{id}
    @PutMapping("/{id}")
    public Task updateTask(@RequestBody Task newTask, @PathVariable Long id) {
        return taskService.updateTask(newTask, id);
    }

    // DELETE: DELETE http://localhost:8080/api/tasks/{id}
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}