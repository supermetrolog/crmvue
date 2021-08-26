export default {
    normalizeDataForForm(data) {
        let array = [];
        let newData = {
            ...data
        };



        newData.directions.map(item => {
            array.push(item.direction)
        });
        newData.directions = array;
        array = [];

        newData.districts.map(item => {
            array.push(item.district)
        });
        newData.districts = array;
        array = [];

        newData.gateTypes.map(item => {
            array.push(item.gate_type)
        });
        newData.gateTypes = array;
        array = [];

        newData.objectClasses.map(item => {
            array.push(item.object_class)
        });
        newData.objectClasses = array;
        array = [];

        newData.objectTypes.map(item => {
            array.push(item.object_type)
        });
        newData.objectTypes = array;
        array = [];

        newData.regions.map(item => {
            array.push(item.region)
        });
        newData.regions = array;
        array = [];
        return newData;
    },
}