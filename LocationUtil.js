
/**
 * 定位工具类 传入定位方法（比如百度提供的安卓sdk，推荐使用高精度定位模式），并使用relocation触发
 * @param {*} locationCallback 
 * @param {*} timeout 
 */
export default class LocationUtil {
    /**
     * 定位工具类 构造器，传入定位函数 和 超时时间
     * @param {*} locationCallback 定位函数
     * @param {*} timeout  超时时间
     */
    constructor(locationCallback, timeout = 10000) {
        this.position = null; // 用来标记是否定位成功
        this.locationCallback = locationCallback; 
        this.timeout = timeout; 
    }
    // 定位成功后，在定位成功的回调函数中，调用此方法，用来标记定位成功
    setLocation(position) {
        console.log("定位成功");
        this.position = position;
    }
    // 提供给用户的外部接口，使用该接口开始定位
    async reLocation() {
        this.position = null;
        const getLocation = () => {
            return new Promise((resolve) => {
                const checkLocation = () => {
                    if (this.position !== null) {
                        resolve();
                    } else {
                        // 每隔三秒再次调用locationCallback
                        setTimeout(checkLocation, 3000); 
                    }
                };
                this.locationCallback();
                checkLocation();
            });
        };

        try {
            // 并发竞争，超时则触发报错，重新定位，直至成功
            await Promise.race([
                getLocation(),
                new Promise((_, reject) => setTimeout(() => reject("定位失败"), this.timeout))
            ]);
            return this.position;
        } catch (error) {
            console.log('定位超时：' + error);
            reLocation();
        }
    }
}
