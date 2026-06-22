import CourseCard from "./CourseCard";

const courses = [
  {
    id: "course-101",
    title: "Advanced Web Design",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    students: 48,
    completion: 78,
  },
  {
    id: "course-102",
    title: "Data Visualization",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    students: 62,
    completion: 42,
  },
  {
    id: "course-103",
    title: "Introduction to UI/UX",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    students: 0,
    completion: 0,
  },
];

interface CourseGridProps {
  getCourseHref?: (courseId: string) => string;
}

export default function CourseGrid({
  getCourseHref,
}: CourseGridProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">
        My Courses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => {
          const { id, ...courseProps } = course;

          return (
          <CourseCard
            key={id}
            href={
              getCourseHref
                ? getCourseHref(id)
                : undefined
            }
            {...courseProps}
          />
          );
        })}
      </div>
    </section>
  );
}
