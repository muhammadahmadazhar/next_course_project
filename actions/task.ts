'use server';
import { TaskData } from '@/app/task/types';
import { Prisma, PrismaClient, Task } from '@prisma/client';
import { date } from 'zod';

const prisma = new PrismaClient();

type TaskQueryData = Prisma.TaskCreateInput;


export async function createTask(data: TaskQueryData) {
    try {
      console.log('data', data);
      const task = await prisma.task.create({
        data: data
      });
      return { success: true, data: task };
    } catch (error) {
      console.error('Error creating Task:', error);
      return { success: false, error: 'Failed to create Task' };
    }
  }



export async function getTasks() {
    try {
        
        const task = await prisma.task.findMany();

        return {
        success: true,
        data: task,
        };
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return { success: false, error: 'Failed to fetch Tasks', data: []  };
    }
}


export async function deleteTask(
    taskId: number,
    ) {
    try {
        await prisma.task.delete({
        where: {
            id: taskId
        }
        });

        return { success: true };
    } catch (error) {
        console.error('Error deleting task:', error);
        return { success: false, error: 'Failed to delete task' };
    }
}

type TaskResponse = {
  success: boolean;
  data: Task | null;
  error?: string;
};

export async function getTaskById(
    taskId: number
  ): Promise<TaskResponse>{
    console.log("Received taskId:", taskId); 
    try {
        console.log('enter')
      const task = await prisma.task.findUnique({
        where: {
          id: taskId
        }
      });
      console.log('tt', task)
  
      if (!task) {
        return {
          success: false,
          error: 'Task not found',
          data: null 
        };
      }

  
      return { success: true, data: task };
    } catch (error) {
      console.error('Error fetching task:', error);
      return { success: false, error: 'Failed to fetch task', data: null };
    }
}


export async function updateTask(
    taskId: number,
    data: Task
  ) {
    console.log('up', taskId, data)
    try {
      const task = await prisma.task.update({
        where: {
          id: taskId
        },
        data: data
      });
      console.log('tr', task)
      return { success: true, data: task };
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, error: 'Failed to update task' };
    }
  }
  