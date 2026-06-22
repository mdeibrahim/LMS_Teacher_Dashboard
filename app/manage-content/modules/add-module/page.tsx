import Link from "next/link";

const courseStats = [
  {
    title: "Total Courses",
    value: 10,
  },
  {
    title: "Total Modules",
    value: 20,
  },
  {
    title: "Draft Modules",
    value: 2,
  },
];

type AddModulePageProps = {
  searchParams: Promise<{
    courseId?: string | string[];
  }>;
};

export default async function AddModulePage({
  searchParams,
}: AddModulePageProps) {
  const { courseId } = await searchParams;
  const selectedCourseId = Array.isArray(courseId)
    ? courseId[0]
    : courseId;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 rounded-2xl text-center sm:grid-cols-2 xl:grid-cols-4">
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
          href="/manage-content/modules/add-module"
          className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl bg-gray-200 p-4 shadow-sm transition-all hover:bg-gray-300"
        >
          <span className="text-5xl font-bold text-green-600">
            +
          </span>
          <p className="mt-2 font-bold text-emerald-600">
            Add New Module
          </p>
        </Link>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">
          Selected Course
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {selectedCourseId
            ? `Course ID: ${selectedCourseId}`
            : "Click a course from the modules page to start adding a module."}
        </p>
      </div>

    </div>
  );
}
