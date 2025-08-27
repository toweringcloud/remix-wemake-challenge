import { Link } from "react-router-dom";
import { useRoleStore } from "~/stores/role.store";
import { recipesData } from "~/data/recipes.data";

export default function RecipeListPage() {
  const { role } = useRoleStore();
  const recipes = recipesData;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {role === "staff" ? "레시피" : "레시피 관리"}
        </h1>
        {/* 스토어에서 가져온 role 값으로 매니저 여부를 확인합니다. */}
        {role === "manager" && (
          <Link to="/dashboard/recipes/new">
            <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
              + 새 레시피 등록
            </button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/dashboard/recipes/${recipe.id}`}
                  className="text-blue-500 hover:underline"
                >
                  상세보기
                </Link>
                {/* 스토어에서 가져온 role 값으로 매니저 여부를 확인합니다. */}
                {role === "manager" && (
                  <div className="flex space-x-2">
                    <Link to={`/dashboard/recipes/${recipe.id}/edit`}>
                      <button className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
                        수정
                      </button>
                    </Link>
                    <button className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
