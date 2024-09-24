'use client';

import menuItems from './menu.data';
import { IndividualMenuItem } from './IndividualMenuItem';

export function AppMenu() {
  return (
    <div className="w-full h-32 md:w-fit text-gray-300 flex justify-center mx-auto">
      <ul className="bg-gray-900 border md:rounded-lg w-full md:w-fit border-gray-700 flex gap-10 justify-around text-xl md:p-2 fixed bottom-0 md:bottom-10 m-auto">
        {menuItems.map((item, index) => (
          <li key={index}>
            <IndividualMenuItem
              href={item.href}
              name={item.name}
              icon={item.icon}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
