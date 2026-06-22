"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export default function AddCoursePage() {
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    description: "",
  });

  const categories = [
    {
      id: 1,
      name: "Web Development",
    },
    {
      id: 2,
      name: "UI/UX Design",
    },
    {
      id: 3,
      name: "Data Science",
    },
  ];

  const subcategories = {
    "Web Development": [
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
    ],
    "UI/UX Design": [
      "UI Design",
      "UX Research",
      "Figma",
    ],
    "Data Science": [
      "Machine Learning",
      "Python",
      "Data Analysis",
    ],
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const router = useRouter();
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log(formData);
    router.push("/manage-content/courses");

    // await api.post("/courses/", {
    //     category: formData.category,
    //     subcategory: formData.subcategory,
    //     title: formData.title,
    //     });

    toast.success(
        "Course Created Successfully!",
        {
            duration: 3000,
        }
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Add New Course
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create a new course and assign it
          to a category.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl bg-white p-4 shadow-sm"
      >
        {/* Category */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.name}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Sub Category
            </label>

            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              disabled={!formData.category}
              className="w-full rounded-lg border border-slate-300 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            >
              <option value="">
                Select Sub Category
              </option>

              {(
                subcategories[
                  formData.category as keyof typeof subcategories
                ] || []
              ).map((sub) => (
                <option
                  key={sub}
                  value={sub}
                >
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Course Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter course title"
            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Course Cover */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Course Cover
          </label>

          <input
            type="file"
            name="cover"
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Course Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Course Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter course description"
            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            className="rounded-xl border border-slate-300 px-6 py-3 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
          >
            Save Course
          </button>
        </div>
      </form>
    </div>
  );
}
