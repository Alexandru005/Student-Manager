package com.alexstefan.backend.service;

import com.alexstefan.backend.model.Task;
import com.alexstefan.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService{
    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository){
        this.taskRepository = taskRepository;
    }

    public Task addTask(Task newTask){
        return taskRepository.save(newTask);
    }

    public List<Task> showAllTasks(){
        return (List<Task>) taskRepository.findAll();
    }

    public Optional<Task> showTaskById(Long id){
        return taskRepository.findById(id);
    }

    public List<Task> showFilteredTasks(String status, String category, LocalDateTime dueTimeMin, LocalDateTime dueTimeMax){
        if(dueTimeMin == null)
            dueTimeMin = LocalDateTime.MIN;
        if(dueTimeMax == null)
            dueTimeMax = LocalDateTime.MIN;

        return taskRepository.filterTasks(status, category, dueTimeMin, dueTimeMax);
    }

    public Task updateTask(Task newTask, Long idOldTask){
        return taskRepository.findById(idOldTask)
                .map(taskExistent -> {
                    taskExistent.setCategory(newTask.getCategory());
                    taskExistent.setDescription(newTask.getDescription());
                    taskExistent.setDueTime(newTask.getDueTime());
                    taskExistent.setStatus(newTask.getStatus());
                    taskExistent.setTitle(newTask.getTitle());
                    return taskRepository.save(taskExistent);
                })
                .orElseThrow(() -> new RuntimeException("Task-ul cu ID-ul " + idOldTask + " nu a fost găsit."));
    }

    public void deleteTask(Long idTask){
        taskRepository.deleteById(idTask);
    }
}
