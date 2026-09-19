package com.alexstefan.backend.repository;


import com.alexstefan.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long>{
    @Query("SELECT t FROM Task t WHERE " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:category IS NULL OR t.category = :category) AND " +
            "(:dueTimeMin <= t.dueTime AND t.dueTime <= :dueTimeMax)")
    List<Task> filterTasks(
            @Param("status") String status,
            @Param("category") String category,
            @Param("dueTimeMin") LocalDateTime dueTime1,
            @Param("dueTimeMax") LocalDateTime dueTime2);
}
