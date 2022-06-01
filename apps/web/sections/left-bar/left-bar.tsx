import { useAuth } from '@syncit/core/hooks';

export function LeftBar() {
  const { userData } = useAuth();
  // const initials =
  return (
    userData ? (
      <div className="drawer-side w-60 shadow-lg  p-4 bg-base-100">
        <div className="flex flex-col overflow-y-auto justify-between">
          <div>
            <h3 className="text-3xl font-bold mb-2">Cal Sync</h3>
            <ul className="menu">
              <li>Sidebar Item 1</li>
              <li>Sidebar Item 2</li>
            </ul>
          </div>
          <div className="flex items-center cursor-pointer">
            <div className="bg-gray-400 rounded-full w-10 h-10 flex justify-center items-center font-bold">
              <div>
                {userData.name?.split(' ')[0][0]}
                {userData.name?.split(' ')[1][0]}
              </div>
            </div>
            <div className="ml-2">
              {userData.name}
              <p className="text-xs truncate text-ellipsis">The user url will appear here</p>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
}

export default LeftBar;
