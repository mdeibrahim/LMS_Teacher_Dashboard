import Sidebar from "@/components/dashboard/Sidebar";
import CourseGrid from "@/components/dashboard/CourseGrid";
import Link from "next/link";

const courseStats = [
  {
    title: "Total Courses",
    value: 10,
  },
  {
    title: "Active Courses",
    value: 8,
  },
  {
    title: "Draft Courses",
    value: 2,
  },
];

export default function CoursesPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="grid gap-5 md:grid-cols-4 text-center rounded-2xl">
          {courseStats.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-gray-200 p-4 shadow-sm transition-colors hover:bg-gray-300"
            >
              <h3 className="text-3xl font-bold text-blue-600">
                {item.value}
              </h3>
              <p className="mt-2 text-gray-500">
                {item.title}
              </p>
            </div>
          ))}

          <Link
            href="/manage-content/courses/add-course"
            className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl bg-gray-200 p-4 shadow-sm transition-all hover:bg-gray-300"
          >
            <span className="text-5xl font-bold text-green-600">
              +
            </span>
            <p className="mt-2 font-bold text-emerald-600">
              Add New Course
            </p>
          </Link>
        </div>

        <div className="space-y-8 mt-10">
          <CourseGrid />
        </div>
      </main>
    </div>
  );
}
