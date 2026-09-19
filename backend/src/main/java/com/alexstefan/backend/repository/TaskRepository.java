package com.alexstefan.backend.repository;


import com.alexstefan.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long>{
}
