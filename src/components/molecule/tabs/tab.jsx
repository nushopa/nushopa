import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

export function TabsWithIcon({data,activeTabValue, handleTabClick}) {
  return (
    <Tabs value={activeTabValue} className="w-full ">
      <TabsHeader
        className="rounded-none w-full overflow-x-auto  p-0 h-20"
        indicatorProps={{
          className:
            "bg-transparent border-b-2  border-mainGreen shadow-none rounded-none py-3 md:py-6 ",
        }}
      >
        {data.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            onClick={()=>handleTabClick(value)}
            className={activeTabValue == value ? "text-mainGreen bg-transparent" : "bg-transparent "}
          >
            <div className="flex flex-row  gap-2">
              <div className="font-semibold font-workSans w-[6.5rem] md:w-[11.5rem] text-md md:text-lg">{label}</div>
            </div>
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value} className="w-full ">
            {desc}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
