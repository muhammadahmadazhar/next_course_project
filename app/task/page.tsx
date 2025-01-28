'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createTask, deleteTask, getTasks } from '@/actions/task';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Prisma, Task } from '@prisma/client';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const titleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
});

type TitleFormValues = z.infer<typeof titleSchema>;

type TaskQueryData = Prisma.TaskCreateInput;

export default function TitleForm() {
  const initialValues: TitleFormValues = { title: '' };
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);

  const onSubmit = async (data: TaskQueryData) => {
    try {
        const result = await createTask(
          data
        );
        if (result.success) {
          console.log('success created task')
          fetchTasks();
        
      }
    } catch (error) {
      console.error(error);
      // toast.error('Failed to create Customer');
    }
  };

  const fetchTasks = async (
  ) => {
    try {
      const result = await getTasks();

      if (!result.success) {
        throw new Error(result.error);
      }
      console.log('result', result.data);
      setTasks(result.data);
    } catch (err) {
      throw err;
    }
  };


  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteConfirm = async (taskId: number) => {

    try {
      const result = await deleteTask(taskId);
      if (result.success) {
        console.log('Deleted task');
        fetchTasks();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (taskId: number) => {
    router.push(`/task/${taskId}`);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Task</h1>
      <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                    onClick={() => signOut({ callbackUrl: '/signin' })}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const result = titleSchema.safeParse(values); // Zod validation
          if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
              errors[err.path[0]] = err.message;
            });
            return errors;
          }
          return {};
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <label className="block text-sm font-medium">Title</label>
            <Field
              name="title"
              type="text"
              placeholder="Enter Task Title"
              className="w-full border px-3 py-2 rounded-md"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-red-500 text-sm"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>

      <div className="space-y-4">
      <h2 className="text-xl font-semibold">Task List</h2>
      {tasks.map((task) => (
        <Card key={task.id} className="shadow-sm">
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Status: {task.status}</p>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => handleEdit(task.id)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteConfirm(task.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    </div>
  );
}
