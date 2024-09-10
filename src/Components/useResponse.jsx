import { useState, useEffect } from "react";
const useResponse = () => {
  const [data, setData] = useState([]);
  const [offsetInfo, setOffsetInfo] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://www.swiggy.com/dapi/restaurants/list/v5?lat=18.61610&lng=73.72860&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
        );
        const data = await response.json();

        setOffsetInfo({
          nextFetch: data.data.nextFetch,
          pageOffset: data.data.pageOffset,
          csrfToken: data.csrfToken,
        });

        const parsedData =
          data?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants.map(
            (current) => ({
              avgRating: current.info.avgRating,
              name: current.info.name,
              imageUrl: current.info.cloudinaryImageId,
              cuisines: current.info.cuisines,
              id: current.info.id,
              sla: current.info.sla,
              costForTwo: current.info.costForTwo,
              deliveryTime: current.info.sla.deliveryTime,
              pageOffset: current.info.pageOffset,
            })
          ) || [];
        setData(parsedData);
        setOffsetInfo(offsetInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return { data, offsetInfo };
};

export default useResponse;
