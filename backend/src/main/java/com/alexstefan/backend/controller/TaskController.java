package com.alexstefan.backend.controller;

import com.alexstefan.backend.model.Task;
import com.alexstefan.backend.service.TaskService;
import org.springframework.web.bind.annotation.*;

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
    public Task adaugaTask(@RequestBody Task newTask) {
        return taskService.addTask(newTask);
    }

    // READ ALL: GET http://localhost:8080/api/tasks
    @GetMapping
    public List<Task> afiseazaToateTaskurile() {
        return taskService.showAllTasks();
    }

    // READ ONE: GET http://localhost:8080/api/tasks/{id}
    @GetMapping("/{id}")
    public Optional<Task> afiseazaTaskDupaId(@PathVariable Long id) {
        return taskService.showTaskById(id);
    }

    // UPDATE: PUT http://localhost:8080/api/tasks/{id}
    @PutMapping("/{id}")
    public Task actualizeazaTask(@RequestBody Task newTask, @PathVariable Long id) {
        return taskService.updateTask(newTask, id);
    }

    // DELETE: DELETE http://localhost:8080/api/tasks/{id}
    @DeleteMapping("/{id}")
    public void stergeTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}