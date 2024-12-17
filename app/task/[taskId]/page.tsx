"use client"
import { getTaskById, updateTask } from "@/actions/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@prisma/client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function EditTask() {
    console.log('edit')
    const router = useRouter();
    const { taskId } = useParams() as { taskId: string };
  
    const [task, setTask] = useState<Task | null>(null);

    useEffect(() => {
        const getTask = async () => {
            // Simulate fetching task by ID
            console.log('taskId--',typeof taskId)
            const fetchedTask = await getTaskById(parseInt(taskId));
            console.log(fetchedTask, 'fet')
            setTask(fetchedTask.data);
        }
        getTask()
      }, [taskId]);

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTask((prev) => ({
          ...prev,
          [name]: value, // Explicitly tell TypeScript this is correct
        } as Task));
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            console.log('sub')
              if (task) {
              const result = await updateTask(task.id, task)
              
              if (result.success){
                  console.log('ssss')
                  router.push("/task");
              }
            }
            } catch (error) {
                console.error(error);
            }
      };

      return (
        <div>
        <Card className="p-6 max-w-lg mx-auto mt-10">
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Task Title</label>
                <input
                  type="text"
                  name="title"
                  value={task?.title || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
    
              <div>
                <label className="block font-medium">Status</label>
                <select
                  name="status"
                  value={task?.status || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
    
              <Button type="submit" variant="default">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>
      );

}