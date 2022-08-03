import {memo, useEffect, useState} from "react";
import {Checkbox, Menu} from "antd";
import {v4 as uuidv4} from "uuid";
const { SubMenu } = Menu;

const MenuFilter = (props) => {
    const {filterList, changeFilter} = props;

    const [checkBoxChecked, setCheckBoxChecked] = useState([]);

    useEffect(() => {
        console.log(filterList)
    }, [filterList]);

    const actionCheckbox = (isChecked,value, type) => {
        let checkBoxCheckedCopy = [...checkBoxChecked];
        if (isChecked){
            checkBoxCheckedCopy.push(value);
        } else{
            checkBoxCheckedCopy = checkBoxCheckedCopy.filter((item) => item != value);
        }
        setCheckBoxChecked(checkBoxCheckedCopy);
        changeFilter(isChecked, value, type);
    }

    return (
        <Menu  mode="inline" className="filter-list" >
            {(Object.keys(filterList).length > 0 && filterList?.categoryTree) && <SubMenu key="categories" title="Categories">
                {   filterList.categoryTree.map((value, index) =>
                    <SubMenu  key={`categories${index}`} title={value.label}>
                        {value.branches.map((valueChildOne, indexChildOne) => <SubMenu key={`categories${index}${indexChildOne}`} title={valueChildOne.label}>
                            {valueChildOne.branches && valueChildOne.branches.map(valueChildTwo => <Menu.Item key={uuidv4()} title={valueChildTwo.label}>
                                <Checkbox checked={checkBoxChecked.includes(valueChildTwo.id)}  onChange={(item) => actionCheckbox(item.target.checked,valueChildTwo.id, 'categoryIds')}>{valueChildTwo.label} ({valueChildTwo.count})</Checkbox>
                            </Menu.Item>)}
                        </SubMenu>)}
                    </SubMenu>
                ) }
            </SubMenu>}
            {Object.keys(filterList).length > 0  && <SubMenu key="advanced-filters" title="Advanced Filters">
                { filterList.attributeTree.map((value, index) => <SubMenu key={`advanced-filters${index}`} title={value.label}>
                    {value.branches.map(valueChild => <Menu.Item key={uuidv4()} title={valueChild.label}>
                        <Checkbox checked={checkBoxChecked.includes(valueChild.id)}  onChange={(item) => actionCheckbox(item.target.checked,valueChild.id, 'attributeIds')}>{valueChild.label} ({valueChild.count})</Checkbox>
                    </Menu.Item>)}
                </SubMenu>)}
            </SubMenu> }

            {(Object.keys(filterList).length > 0 && filterList?.cityTree ) &&  <SubMenu key="places" title="Places">
                {  filterList.cityTree.map((value, index) => <SubMenu key={`places${index}`} title={value.label}>
                    {value.branches.map(valueChild => <Menu.Item key={uuidv4()} title={valueChild.label}>
                        <Checkbox checked={checkBoxChecked.includes(valueChild.id)}  onChange={(item) => actionCheckbox(item.target.checked,valueChild.id, 'placeIds')}>{valueChild.label} ({valueChild.count})</Checkbox>
                    </Menu.Item>)}
                </SubMenu>)}
            </SubMenu>}

        </Menu>
    )
}

export default memo(MenuFilter);