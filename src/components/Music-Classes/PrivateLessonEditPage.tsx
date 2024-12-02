import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";

// Define types for lessons and individual lesson
interface Lesson {
  id: string;
  lessonTitle: string;
  lessonPrice: string;
}

export default function PrivateLessonEditPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [myLesson, setMyLesson] = useState<Lesson>({
    id: Math.floor(10000000 + Math.random() * 90000000).toString(),
    lessonTitle: "",
    lessonPrice: "",
  });

  const handleAddLesson = () => {
    setLessons([...lessons, myLesson]);
    setMyLesson({
      id: Math.floor(10000000 + Math.random() * 90000000).toString(),
      lessonTitle: "",
      lessonPrice: "",
    });
  };

  const handleDeleteLesson = (id: string) => {
    setLessons(lessons.filter((lesson) => lesson.id !== id));
  };

  return (
    <div className="p-12 flex  flex-col gap-12">
      <h1 className="text-2xl font-bold text-green-900 mb-6">
        PRIVATE LESSONS
      </h1>

      {/* Number of Lessons Section */}
      <div className="flex items-center justify-between mb-8 ">
        <div>
          <p className="font-semibold text-gray-800 mb-1">NO OF LESSONS</p>
          <div className="flex items-center space-x-20">
            <input
              type="number"
              className="border border-gray-300 rounded-md px-4 py-2 bg-gray-200 focus:outline-none"
              placeholder=""
              disabled
            />
            <div>
              <p className="text-gray-700">Max</p>
              <p className="text-xl font-bold text-gray-800">10</p>
            </div>
            <button className="px-6 py-2 bg-green-900 text-white rounded-md hover:bg-green-800">
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Length Section */}
      <div className="mb-6 ">
        <p className="font-semibold text-gray-800 mb-1">LESSON LENGTH</p>
        <div className=" items-center space-x-20 mb-4">
          <input
            type="text"
            className="border border-gray-300 rounded-md px-4 py-2 bg-gray-200 focus:outline-none"
            placeholder="Title"
            value={myLesson.lessonTitle}
            onChange={(e) =>
              setMyLesson({ ...myLesson, lessonTitle: e.target.value })
            }
          />
          <input
            type="number"
            className="border border-gray-300 rounded-md px-4 py-2 bg-gray-200 focus:outline-none"
            placeholder="Price"
            value={myLesson.lessonPrice}
            onChange={(e) =>
              setMyLesson({ ...myLesson, lessonPrice: e.target.value })
            }
          />
          <button
            onClick={handleAddLesson}
            className="px-6 py-2 bg-green-900 text-white rounded-md hover:bg-green-800"
            disabled={
              myLesson.lessonTitle === "" || myLesson.lessonPrice === ""
            }
            title={
              myLesson.lessonTitle === "" || myLesson.lessonPrice === ""
                ? "disabled"
                : "Add Lesson"
            }
          >
            Add
          </button>
        </div>
      </div>

      {/* Lessons List */}
      {lessons.length > 0 && (
        <div className="bg-gray-100 p-4 lg:w-[70%] 2xl:w-[50%] rounded-lg shadow-md">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between border-b border-gray-300 py-2 last:border-b-0"
            >
              <div className="text-gray-800 font-semibold">{lesson.id}</div>
              <div className="text-gray-800 font-semibold">
                {lesson.lessonTitle}
              </div>
              <div className="text-gray-800 font-semibold">
                {lesson.lessonPrice}
              </div>
              <button
                onClick={() => handleDeleteLesson(lesson.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
