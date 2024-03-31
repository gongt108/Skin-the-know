import React from 'react';
import WeekCard from './components/WeekCard';

const weeks = [
	{
		id: 1,
		sunday_am: [],
		sunday_pm: [],
		monday_am: [],
		monday_pm: [],
		tuesday_am: [],
		tuesday_pm: [],
		wednesday_am: [],
		wednesday_pm: [],
	},
	{
		id: 2,
		sunday_am: [],
		sunday_pm: [],
		monday_am: [],
		monday_pm: [],
		tuesday_am: [],
		tuesday_pm: [],
		wednesday_am: [],
		wednesday_pm: [],
	},
];

function Profile() {
	return (
		<div className="h-full flex flex-col w-[60rem] mx-auto">
			<div className="mt-4 mx-auto flex space-x-2 ">
				<p className="font-semibold text-black">Week: </p>
				{weeks.map((week, i) => (
					<div className="text-blue-500 cursor-pointer" key={i}>
						{i + 1}
					</div>
				))}
				<div className="button cursor-pointer">+</div>
			</div>
			<WeekCard />
		</div>
	);
}

export default Profile;
