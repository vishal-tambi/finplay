import DragAndDrop from './components/DragAndDrop';
import QuizGame from './components/QuizGame'; // Import the FinanceGame component

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* <QuizGame /> */}
      <DragAndDrop />
    </div>
  );
}
