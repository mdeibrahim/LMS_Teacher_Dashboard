import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  image: string;
  students: number;
  completion: number;
  href?: string;
}

export default function CourseCard({
  title,
  image,
  students,
  href,
}: Props) {
  const CardContent = (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm transition-transform duration-200 hover:-translate-y-1">
      <div className="relative h-48 w-full text-sm">
        <Image
          src={image}
          alt={title}
          fill
          priority
          unoptimized
          className="object-cover text-sm"
        />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-2xl">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          {students} Students
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
