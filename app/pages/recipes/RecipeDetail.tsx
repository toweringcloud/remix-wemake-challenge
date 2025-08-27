import { Link, useParams } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";
import { recipesData } from "~/data/recipes.data";

export default function RecipeDetailPage() {
  const { role } = useRoleStore();
  const { recipeId } = useParams();

  // 실제 앱에서는 useParams의 recipeId를 사용해 API로 데이터를 가져옵니다.
  // ✅ URL의 recipeId와 일치하는 레시피를 데이터 배열에서 찾습니다.
  const recipe = recipesData.find((r) => r.id === recipeId);
  if (!recipe) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">레시피를 찾을 수 없습니다.</h1>
        <Link
          to="/dashboard/recipes"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{recipe.name}</h1>
        <div className="flex space-x-3">
          <Link to="/dashboard/recipes">
            <button className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600">
              목록으로
            </button>
          </Link>
          {/* 매니저일 경우에만 '수정하기' 버튼이 보입니다. */}
          {role === "manager" && (
            <Link to={`/dashboard/recipes/${recipe.id}/edit`}>
              <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                수정하기
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <p className="text-lg text-gray-600 mb-8">{recipe.description}</p>

        {/* 재료 섹션 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4">
            필요한 재료
          </h2>
          <ul className="list-disc list-inside space-y-2">
            {recipe.ingredients.map((ing, index) => (
              <li key={index} className="text-gray-700">
                <span className="font-semibold">{ing.name}</span>: {ing.amount}
              </li>
            ))}
          </ul>
        </div>

        {/* 만드는 법 섹션 */}
        <div>
          <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4">만드는 법</h2>
          <ol className="list-decimal list-inside space-y-3">
            {recipe.steps.map((step, index) => (
              <li key={index} className="text-gray-700 leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
