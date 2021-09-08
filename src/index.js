import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactTooltip from "react-tooltip";


var list_names = {}
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};
/**
 * Moves an item from one list to another list.
 */
const copy = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, { ...item, uuid: uuid() });
    return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const CustomGrid = styled.div`
    display: flex;
    width:1100px;
`;

const Content = styled.div`
  margin-right: 200px;
`;

const Item = styled.div`
  display: flex;
  user-select: none;
  padding: 0.5rem;
  margin: 0 0  0.5rem 0;
  align-items: flex-start;
  align-content: flex-start;
  line-height: 1.5;
  border-radius: 3px;
  background: #fff;
  border: 1px ${props => (props.isDragging ? 'dashed #000' : 'solid #ddd')};

 `;

 const ItemCard = styled.div`
  display: flex;
  user-select: none;
  padding: 0.5rem;
  margin: 0 0  0.5rem 0;
  align-items: flex-start;
  align-content: flex-start;
  line-height: 1.5;
  border-radius: 3px;
  background: #fff;
  max-width:20%
  border: 1px ${props => (props.isDragging ? 'dashed #000' : 'solid #ddd')};

 `;

const Clone = styled(Item)`
  + div {
    display: none!important;
  }
`;

const Handle = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  user-select: none;
  margin: -0.5rem 0.5rem -0.5rem -0.5rem;
  padding: 0.5rem;
  line-height: 1.5;
  border-radius: 3px 0 0 3px;
  background: #fff;
  border-right: 1px solid #ddd;
  color: #000;
`;

const List = styled.div`
  border: 1px ${props => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};
  background: #fff;
  padding: 0.5rem 0.5rem 0;
  border-radius: 3px;
  flex: 0 0 150px;
  font-family: sans-serif;
  width: 300px;
`;

const Kiosk = styled(List)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 250px;
`;

const Container = styled(List)`
  margin: 0.5rem 0.5rem 1.5rem;
`;

const GridItemContainer = styled.div`
  
 
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem;
  border: 1px solid transparent;
  line-height: 1.5;
  color: #aaa;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  color: #000;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
`;

const SmallText = styled.p`
  font-size:0.8rem
`;

const MainText = styled.h4`

`;

const ButtonText = styled.div`
  margin: 0 1rem;
`;

const ITEMS = [
    {
        id: uuid(),
        content: 'Headline'
    },
    {
        id: uuid(),
        content: 'Copy'
    },
    {
        id: uuid(),
        content: 'Image'
    },
    {
        id: uuid(),
        content: 'Slideshow'
    },
    {
        id: uuid(),
        content: 'Quote'
    }
];

class App extends Component {
    state = {

    };
    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                this.setState({
                    [destination.droppableId]: reorder(
                        this.state[source.droppableId],
                        source.index,
                        destination.index
                    )
                });
                break;
            case 'ITEMS':
                this.setState({
                    [destination.droppableId]: copy(
                        iot_devices,
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                });
                break;
            default:
                this.setState(
                    move(
                        this.state[source.droppableId],
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                );
                break;
        }
    };

    addList = e => {
        const id = uuid()
        const enteredName = prompt('Please enter room name')
        list_names[id] = enteredName
        

        console.log(list_names)
        this.setState({ [id]: {
            data:[], name:enteredName} });

    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="ITEMS" isDropDisabled={true}>
                    {(provided, snapshot) => (
                        <Kiosk
                            innerRef={provided.innerRef}
                            isDraggingOver={snapshot.isDraggingOver}>
                                <h3>KIOSK</h3>
                            {iot_devices.map((item, index) => (
                                <Draggable
                                    key={item.uuid}
                                    draggableId={item.uuid}
                                    index={index}>

                                    {(provided, snapshot) => (
                                        <React.Fragment>
                                            
                                            <Item
                                                innerRef={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                isDragging={snapshot.isDragging}
                                                style={
                                                    provided.draggableProps
                                                        .style
                                                }
                                                data-tip data-for={item.uuid}
                                                >
                                                <div>
                                                    <MainText>
                                                        {item['Device Name']}
                                                    </MainText>
                                                    <SmallText>{item['Category']}</SmallText>

                                                    <ReactTooltip id={item.uuid} type='info' effect='solid' place='left'  multiline={true}>
                                                        <span>{item.Function}</span>
                                                    </ReactTooltip>
                                                </div>
                                                
                                            </Item>
                                            
                                            {snapshot.isDragging && (
                                                <Clone>{item['Device Name']}</Clone>
                                            )}
                                        </React.Fragment>
                                    )}
                                </Draggable>
                            ))}
                        </Kiosk>
                    )}
                </Droppable>
                <Content>

                    <div style={{"background":"white", "height":"70px", "margin":"20px 5px 0 0", "padding": "5px 15px 5px"}}>
                        <h2>Philtrum</h2>
                    </div>
                    <Button onClick={this.addList}>
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                            />
                        </svg>
                        <ButtonText>Add List</ButtonText>
                    </Button>


                    <CustomGrid>
                    
                    {Object.keys(this.state).map((list, i) => (
                             <GridItemContainer>
                        <Droppable key={list} droppableId={list}>
                            {(provided, snapshot) => (
                                <Container
                                    innerRef={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}>

                                    <h3>{list_names[list]}</h3>



                                    {this.state[list].length
                                        ? this.state[list].map(
                                              (item, index) => (
                                             
                                                  <Draggable
                                                      key={item.uuid}
                                                      draggableId={item.uuid}
                                                      index={index}>


                                                      {(provided, snapshot) => (
                                                          <Item
                                                              innerRef={
                                                                  provided.innerRef
                                                              }
                                                              {...provided.draggableProps}
                                                              isDragging={
                                                                  snapshot.isDragging
                                                              }
                                                              style={
                                                                  provided
                                                                      .draggableProps
                                                                      .style
                                                              }>
                                                                
                                                              <Handle
                                                                  {...provided.dragHandleProps}>
                                                                  <svg
                                                                      width="24"
                                                                      height="24"
                                                                      viewBox="0 0 24 24">
                                                                      <path
                                                                          fill="currentColor"
                                                                          d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                                                      />
                                                                  </svg>
                                                              </Handle>
                                                              
                                                              {item['Device Name']}
                                                          </Item>
                                                      )}

                                                  </Draggable>
                                              )
                                          )
                                        : !provided.placeholder && (
                                              <Notice>Drop items here</Notice>
                                          )}

                                    

                                    {provided.placeholder}
                                </Container>
                            )}
                        </Droppable>
                        </GridItemContainer>
                    ))}
                    </CustomGrid>
                </Content>
            </DragDropContext>
        );
    }
}



const iot_devices = [
    {
      
      "Device Name": "Bitdefender BOX",
      "Type": "Residential",
      "Price": "$199.99",
      "Category": "Network Security",
      "Purpose": "Device Security",
      "Function": "Security solution which blocks incoming threats and can scan all your devices for vulnerabilities. It protects all your IoT devices, even when you go out! Can act as a wireless router or go alongside your current one.",
      "Company": "Bitdefender",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "3.50 x 3.50 x 1.10 inches",
      "Installation Type": "Indoors",
      "Connection Type": "Wired",
      "System Access": "Propietory",
      "uuid": uuid()
    },
    {
      "": 1,
      "Device Name": "Amazon Echo (2nd Generation) - Voice controller",
      "Type": "Residential",
      "Price": "$99.99",
      "Category": "IOT Remote Controls",
      "Purpose": "Voice Controller",
      "Function": "Amazon Echo, the connected voice controller from Amazon, can give you information, music, news, weather, add things to todo lists, wake you up and, of course, control your home.",
      "Company": "Amazon",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "5.8” x 3.4” x 3.4”",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "Open Source",
      "uuid": "135f95ba-7450-4edf-ab57-513ded5905aa"
    },
    {
      "": 2,
      "Device Name": "Nest Cam - Indoor camera",
      "Type": "Commercial, Residential",
      "Price": "$129.00",
      "Category": "IoT Consumer Security Cameras",
      "Purpose": "Remote/Streaming Camera",
      "Function": "Nest Cam Outdoor is the monitoring tool you've been waiting for. It brings all the benefits of modern streaming technology and a sleek design so you can watch your home from anywhere.",
      "Company": "Google",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "2.80 x 2.80 x 4.50 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "f5d311f0-e7b2-4c8d-833a-d116cab61a20"
    },
    {
      "": 3,
      "Device Name": "TrackR bravo - Tracking Device",
      "Type": "Residential",
      "Price": "$13.66",
      "Category": "IoT Home Security and Safety",
      "Purpose": "Item Tracker",
      "Function": "TrackR bravo is the coin-sized tracking device that locates your belongings in real time & notifies you their location, whether they are lost or misplaced. Great for wallets, keys, phones or pets.",
      "Company": "TRACKR, INC.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "1.2 x 0.2 x 1.2 inches",
      "Installation Type": "Indoors",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "990b94c3-6fa7-4566-9e8a-13808d31a8ae"
    },
    {
      "": 4,
      "Device Name": "Amazon Echo Spot - Smart Alarm Clock",
      "Type": "Residential",
      "Price": "$89.99",
      "Category": "IoT Home Appliances",
      "Purpose": "Info Display",
      "Function": "Amazon Echo Spot is a smart alarm clock that can make video calls, with a tiny 2.5-inch screen, or become a nursery camera. It can also be connected to external speakers, either through cable or Bluetooth.",
      "Company": "Amazon",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "4.1” x 3.8” x 3.6”",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "8cea79c2-5f00-4b50-aed3-bb1f24708fb5"
    },
    {
      "": 5,
      "Device Name": "BB8 SE - Droid with force band",
      "Type": "Commercial, Residential",
      "Price": "$329.99",
      "Category": "IoT Information and Entertainment",
      "Purpose": "",
      "Function": "BB-8 is the loyal droid of Resistance pilot Poe Dameron. Control it with the force band or with your smart device and see it roll just like on screen. Immerse yourself in the Star Wars galaxy.",
      "Company": "Sphero",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "4.02 x 2.87 x 4.49 inches",
      "Installation Type": "-",
      "Connection Type": "-",
      "System Access": "",
      "uuid": "10f7d096-7002-4773-b458-e53efbf7fc09"
    },
    {
      "": 6,
      "Device Name": "Nest Thermostat - Smart Thermostat",
      "Type": "Residential",
      "Price": "$199.00",
      "Category": "IoT Thermostats",
      "Purpose": "Temp Control",
      "Function": "The Nest Thermostat learns what temperature you like and builds a schedule around yours. Also, it will send you an alert when the temperatures are threatening to ruin your belongings and appliances.",
      "Company": "Google",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "3.3 x 3.3 x 1.21 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "dfb74582-a3d5-40cd-b21c-7dee925163cb"
    },
    {
      "": 7,
      "Device Name": "Logitech Pop - Smart button controller",
      "Type": "Residential",
      "Price": "$59.99",
      "Category": "Home Automation",
      "Purpose": "Remote Control",
      "Function": "POP Home Switch lets everyone in the home control smart lighting, music, and more with the push of a button. Program each switch with up to three custom commands to add creativity throughout your smart home.",
      "Company": "Logitech",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "4.92 x 4.92 x 2.44 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "f5e4b497-864f-45f0-9793-c7dbba99b95a"
    },
    {
      "": 8,
      "Device Name": "Nest Cam Outdoor - Outdoor camera",
      "Type": "Residential",
      "Price": "$149.00",
      "Category": "IoT Home Security and Safety",
      "Purpose": "Remote/Streaming Camera",
      "Function": "With one app for all your Nest products, the unique magnetic mount, full 1080p HD video streaming and advanced Night Vision, Nest Cam Outdoor enables you to take care of what matters 24/7.",
      "Company": "GOJFK",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "2.8 x 2.8 x 3.5 inches",
      "Installation Type": "Exposed",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "23aab101-a4a0-487f-80f5-f5541022cb8f"
    },
    {
      "": 9,
      "Device Name": "Logitech Harmony Elite - Smart Controller",
      "Type": "Residential",
      "Price": "$269.97",
      "Category": "Home Automation",
      "Purpose": "Smart Remote",
      "Function": "Integrate control of your connected lights, locks, thermostats, sensors, home entertainment devices, and more - all accessible from either an rechargeable touch screen remote or handy mobile app.",
      "Company": "Logitech",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "6 x 2 x 0.6 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "b88ca42b-3e2d-4992-b0c5-61ae6c299542"
    },
    {
      "": 10,
      "Device Name": "Awair - Smart Air Quality Monitor",
      "Type": "Residential",
      "Price": "$149",
      "Category": "IoT Residential HVAC Systems",
      "Purpose": "Air Sensor",
      "Function": "Awair is the first complete device to let you communicate with your air. Awair analyzes your indoor air quality, learns your routines and can communicate with other home devices to help you achieve optimal air quality.",
      "Company": "Awair LLC",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "1.97 x 6.3 x 3.54 inches",
      "Installation Type": "Indoors",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "7c9c9eb4-3bf1-4627-bc30-b8fd9c767d36"
    },
    {
      "": 11,
      "Device Name": "Hydrawise - Smart Irrigation Controller",
      "Type": "Commercial, Residential",
      "Price": "$182.09",
      "Category": "IoT Garden Equipment",
      "Purpose": "Water Senor Controller",
      "Function": "Manage your irrigation controller and save water with predictive schedules from anywhere using your smart device or web browser with Hydrawise web-based software.",
      "Company": "Hunter Industries",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "5 x 1.5 x 6 inches",
      "Installation Type": "Exposed",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "6ae02f0e-8444-45e3-be35-9d8d803ce50c"
    },
    {
      "": 12,
      "Device Name": "June - Intelligent oven",
      "Type": "Commercial, Residential",
      "Price": "$1,332.05",
      "Category": "IoT Home Appliances",
      "Purpose": "",
      "Function": "June is a modern oven prepared to fit in every kitchen in order to satisfy even the most exquisite tastes. It saves a lot of the time you'd normally spend cooking when connected to your phone.",
      "Company": "June Oven",
      "Data Type": "Home, Consumer",
      "Device Security": "-",
      "Dimensions": "22 x 18 x 13 inches",
      "Installation Type": "Indoors",
      "Connection Type": "-",
      "System Access": "",
      "uuid": "1abd216e-369b-4a1e-b086-e76049491128"
    },
    {
      "": 13,
      "Device Name": "August - Smart lock",
      "Type": "Residential",
      "Price": "$179.99",
      "Category": "Consumer Smart Locks",
      "Purpose": "",
      "Function": "No more fumbling for keys. Control access to your home with Amazon Alexa, Apple HomeKit or your smartphone. Auto-unlocks your door as you approach and automatically locks your door after you enter. No more hiding keys under the mat with virtual keys, and the 24/7 activity log lets you know who opens you door and when. Your exterior door hardware stays the same. August Smart Lock replaces only the the interior of your standard deadbolt. Install yourself in minutes.",
      "Company": "August Home",
      "Data Type": "Home, Consumer",
      "Device Security": "-",
      "Dimensions": "3.4 x 3.4 x 2.2 inches",
      "Installation Type": "Indoors",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "b2402512-31f1-4935-81ea-862cd79c194a"
    },
    {
      "": 14,
      "Device Name": "Triby - Smart portable speaker",
      "Type": "Residential",
      "Price": "$121.69",
      "Category": "Smart Wireless Speakers",
      "Purpose": "",
      "Function": "Triby is the first Alexa-enabled speaker that is fully portable yet can hear you from across the room. Its design is as adorable as it is practical with buttons for shortcuts to your favorite music and an always-on screen to display memos, information about what you are listening to, and much more.",
      "Company": "Invoxia",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "6 x 1.18 x 6 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "91f66406-075f-409c-995b-ea674456b467"
    },
    {
      "": 15,
      "Device Name": "Kinsa - Smart thermometer",
      "Type": "Medical",
      "Price": "-",
      "Category": "IoT Healthcare Devices",
      "Purpose": "",
      "Function": "With its Smart Thermometer, Kinsa wants to revolutionize the thermometer by getting it to read the \"health weather\" of a community",
      "Company": "Kinsa, Inc.",
      "Data Type": "Medical",
      "Device Security": "-",
      "Dimensions": "8 x 3.5 x 1.5 inches",
      "Installation Type": "Indoors",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "d1eba4d7-f1a1-4086-b82a-1257f9ab2b49"
    },
    {
      "": 16,
      "Device Name": "Ring Pro - Smart Video Doorbell",
      "Type": "Residential",
      "Price": "$189.00",
      "Category": "IoT Consumer Security Cameras",
      "Purpose": "",
      "Function": "Ring Pro provides a new level of security, by notifying you when someone is on your property and letting you see and speak with anyone at your front door. 1080HD video & infrared night vision. Existing doorbell wiring required.",
      "Company": "Ring",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "4.50 in x 1.85 in x 0.8 in",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "741ac8e7-fae0-4dd0-8d11-245ffdf995aa"
    },
    {
      "": 17,
      "Device Name": "Fitbit Surge - Smart Watch",
      "Type": "Wearable Sensor",
      "Price": "$300.00",
      "Category": "IoT Health and Fitness",
      "Purpose": "Wearable",
      "Function": "Train smarter and go farther with Surge—a sleek, fitness super watch designed to help you reach your peak performance. With built-in GPS, multisport functionality, and automatic, continuous heart rate, Surge delivers the stats you need to measure your effort and maximize your training time. Add activity tracking, automatic sleep detection, music control, and text and call notifications, and you have everything you need to stay connected, motivated and in the zone—no matter what goal you’re working toward.",
      "Company": "Fitbit, Inc.",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "8.2 x 1.4 x 0.6 inches",
      "Installation Type": "Exposed",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "8ac044d1-f0d9-4744-b03d-f018771a075a"
    },
    {
      "": 18,
      "Device Name": "Eero - Home WiFi System",
      "Type": "Residential",
      "Price": "$399.00",
      "Category": "Smart WiFi Systems",
      "Purpose": "",
      "Function": "eero is the world's first home WiFi system. A set of three eeros covers the typical home. They work in perfect unison to deliver hyper-fast, super-stable WiFi to every square foot of your house.",
      "Company": "eero LLC",
      "Data Type": "Home, Consumer",
      "Device Security": "-",
      "Dimensions": "4.76in x 4.76in x 1.26in",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Wired",
      "System Access": "",
      "uuid": "1ace3879-a8b7-4044-9d38-ea11a4920d13"
    },
    {
      "": 19,
      "Device Name": "Honeywell - Wifi Smart Thermostat",
      "Type": "Residential",
      "Price": "$138.00",
      "Category": "IoT Thermostats",
      "Purpose": "Temp Control",
      "Function": "Honeywell Wi-Fi Smart Thermostat, Control from anywhere, via iPhone, iPad, Android and computer.The extreme flexibility of the Honeywell Wi-Fi smart thermostat allows you to uniquely program your device as either a home or business thermostat and then offers scheduling features specific to your home or business.For a business, simply select the temperature that you prefer when the building is occupied, and you won't have to worry about cold mornings or hot afternoons.",
      "Company": "Honeywell",
      "Data Type": "Home, Consumer",
      "Device Security": "-",
      "Dimensions": "4.5 x 0.88 x 3.5 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "cf4af870-5d38-435b-93d8-8bd19ee4d1ff"
    },
    {
      "": 20,
      "Device Name": "Blossom - Smart watering controller",
      "Type": "Residential",
      "Price": "$69.95",
      "Category": "IoT Garden Equipment",
      "Purpose": "Water Senor Controller",
      "Function": "Simplify your life with the power of Smart Watering. Blossom self-programs based on real-time weather data and gives you control right from your phone, lowering your water bill up to 30%.",
      "Company": "Scotts",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "4 x 8.75 x 9 inches",
      "Installation Type": "Exposed",
      "Connection Type": "-",
      "System Access": "",
      "uuid": "8f2bc3ce-f518-412c-a460-60d8be9a6717"
    },
    {
      "": 21,
      "Device Name": "iGrill Mini - Smart grill thermometer",
      "Type": "Residential",
      "Price": "-",
      "Category": "IoT Kitchen Appliances",
      "Purpose": "",
      "Function": "Using this Bluetooth Smart grilling thermometer you'll know when your food is ready from your mobile device. Choose from dozens of preset temperature alarms or create your own in the iDevices Connected app based on what you're grilling/smoking and head back inside while your meat cooks.",
      "Company": "iDevices LLC (iGrill) - L&G",
      "Data Type": "Home, Consumer",
      "Device Security": "-",
      "Dimensions": "2 x 1.75 x 1.5 inches",
      "Installation Type": "Indoors",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "a43a3f1c-003b-4b28-96d5-56c6b5c67ae4"
    },
    {
      "": 22,
      "Device Name": "Mimo - Smart baby monitoring",
      "Type": "Wearable Sensor",
      "Price": "$349.95",
      "Category": "IoT Health and Fitness",
      "Purpose": "",
      "Function": "Designed for today’s new parents, the Mimo keeps you connected to your baby no matter where you are - whether you're across the room or across the world. Available on iOS and Android, the Mimo app gives you insight about your baby's sleep quality, sleep activity, respiration, body position, and skin temperature.",
      "Company": "Mimo",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "11.3 x 2.6 x 7 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "6da458d2-f71d-4616-b5c2-b66087571c66"
    },
    {
      "": 23,
      "Device Name": "Skydrop - Sprinkler Controller",
      "Type": "Residential",
      "Price": "-",
      "Category": "IoT Garden Equipment",
      "Purpose": "Water Senor Controller",
      "Function": "Skydrop was designed for smart, responsible, environmentally-conscious homeowners and professionals — like you — who are passionate about a gorgeous lawn that will make all the neighbors green with envy… but not as green as your lawn. Using adaptive algorithms to generate custom and dynamic watering schedules from your weather data, Skydrop automatically determines the optimal watering schedule for each one of your lawn’s zones.",
      "Company": "Skydrop",
      "Data Type": "Home, Consumer",
      "Device Security": "-",
      "Dimensions": "12.3 x 9.5 x 5 inches",
      "Installation Type": "Exposed",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "81c3ceed-936d-4ae9-9d31-8b58dc7f4481"
    },
    {
      "": 24,
      "Device Name": "Notion - Home Intelligence Sensors",
      "Type": "Residential",
      "Price": "-",
      "Category": "Home Automation",
      "Purpose": "Multi Purpose Montioring",
      "Function": "Notion's sensors can be thermostats, burglar alarms, leak detectors - or anything else you can think of.",
      "Company": "Notion",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "1.5 x 1.5 x 0.5 inches",
      "Installation Type": "Indoors",
      "Connection Type": "-",
      "System Access": "",
      "uuid": "9e2ce051-4dcc-4096-bf73-b0e0d5bc3fe8"
    },
    {
      "": 25,
      "Device Name": "Anova - Precision cooker",
      "Type": "Residential",
      "Price": "$199.00",
      "Category": "IoT Kitchen Appliances",
      "Purpose": "",
      "Function": "The Anova precision cooker makes it easy to achieve professional-level cooking results at home. To use, simply attach the cooker to any water-filled pot, put your food in a sealable bag, and set the time and temperature. The precision cooker heats and circulates the water to a precise temperature, cooking food to an exact temperature which creates maximum tenderness and moisture retention (without worry of overcooking).",
      "Company": "Anova Culinary",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "14.75 x 2.75 x 2.75 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "540868ff-91a0-4fd6-b24f-3708b56b7795"
    },
    {
      "": 26,
      "Device Name": "SenseCeiver 4-20mA - Wireless IoT Gateway for 4-20mA Applications",
      "Type": "Terminal Set",
      "Price": "€ 199.00",
      "Category": "Terminal Set",
      "Purpose": "Gateway",
      "Function": "SenseCeiver 4-20mA reads data of industrial 4-20mA sensors and enables real-time transmission to the cloud. Depending on the variant, data is transmitted via mobile radio via LTE Cat NB1, LTE Cat M1, LTE 4G, 3G or 2G.",
      "Company": "Round Solutions",
      "Data Type": "-",
      "Device Security": "-",
      "Dimensions": "75x50",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "01ed716f-b8e9-492b-82c6-da21ee414069"
    },
    {
      "": 27,
      "Device Name": "MakerFocus M5Stack ESP32 Series Basic Core IoT Development Kit",
      "Type": "Commercial, Industrial",
      "Price": "$43.99",
      "Category": "Utilities",
      "Purpose": "Development Kit",
      "Function": "A palm-sized device, office can be used as a recording pen and timer; out as a GPS recorder can be used; at home can be used as a smoke alarm, camera; Connect several a few lines, but also do small toys;",
      "Company": "MakerFocus",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "0.77 x 1 x 0.1 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "c50e239c-b746-4fd5-b0c4-4b9353d0aaa7"
    },
    {
      "": 28,
      "Device Name": "Awair Element",
      "Type": "Industrial",
      "Price": "$149",
      "Category": "Environmental",
      "Purpose": "Air Sensor",
      "Function": "he Awair app makes it easy to understand how your indoor activities are impacting your air quality and influencing the way you feel.",
      "Company": "Awair Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "3.33 x 6.06 x 1.80 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "fa9e47b5-30f6-4ba2-bfa4-3456cd5eb2ac"
    },
    {
      "": 29,
      "Device Name": "Wemo Smart Light Switch 3-Way",
      "Type": "Residential",
      "Price": "$49.99",
      "Category": "smart home- iot",
      "Purpose": "Lighting  Control",
      "Function": "The Wemo Smart Light Switch allows you to control lights and ceiling fans from the wall, the Wemo App, or with your voice*.",
      "Company": "Belkin",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "1.72\" W x 4.1\" H x 1.64\" D",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "08faa9cc-ee2d-4788-882d-3b15734d1c6f"
    },
    {
      "": 30,
      "Device Name": "Wemo Mini Smart Plug",
      "Type": "Residential",
      "Price": "$29.99",
      "Category": "smart home- iot",
      "Purpose": "Smart Socket",
      "Function": "The Wemo Mini Smart Plug lets you control your electronic devices right from your phone or tablet.",
      "Company": "Belkin",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "3.8\" L x 1.4\" H x 2.4\" D",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "0163aa0d-5d01-482f-9bcf-8833c31715a5"
    },
    {
      "": 31,
      "Device Name": "Wemo Bridge",
      "Type": "Residential",
      "Price": "$39.99",
      "Category": "smart home- iot",
      "Purpose": "Network Bridge",
      "Function": "With the Wemo Bridge, you can quickly and easily enable your Wemo devices to work with Apple HomeKit.",
      "Company": "Belkin",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "2.55” L x 5.8” H x 5.5” D",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "446b423d-2471-455e-b3c1-70588c07951d"
    },
    {
      "": 32,
      "Device Name": "Canary View",
      "Type": "Residential",
      "Price": "$198.00",
      "Category": "Security Systems",
      "Purpose": "Smart Camera",
      "Function": "Canary View unites security and intelligence, featuring 1080p HD video backed by powerful AI capabilities.",
      "Company": "Canary Connect Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "6\" x 3",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "35954b96-10ac-4810-9009-fdd6a8730284"
    },
    {
      "": 33,
      "Device Name": "MYQ® SMART GARAGE™ HUB",
      "Type": "Residential",
      "Price": "$39.98",
      "Category": "Remotes and Accessories",
      "Purpose": "Smart Remote",
      "Function": "Chamberlain MyQ products allow you to control your existing garage door with your iPhone or Android device.",
      "Company": "The Chamberlain Group Inc.",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "4.5 x 1.5 x 4.5 inches",
      "Installation Type": "Exposed",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "ce8762b2-e4c1-459f-a021-c6e082e0d761"
    },
    {
      "": 34,
      "Device Name": "SMART LED LIGHT",
      "Type": "Residential",
      "Price": "$79.99",
      "Category": "Remotes and Accessories",
      "Purpose": "Lighting  Control",
      "Function": "Control and schedule your LED light from anywhere with your smartphone.",
      "Company": "The Chamberlain Group Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "8” x 8” x 2.5”",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "c8a5440c-94d3-4d4f-bd59-7e8b5ddb3fe3"
    },
    {
      "": 35,
      "Device Name": "MYQ® HOME BRIDGE",
      "Type": "Residential",
      "Price": "$69.99",
      "Category": "Remotes and Accessories",
      "Purpose": "Network Bridge",
      "Function": "Add smartphone control to myQ enabled products that don’t have built in Wi-Fi.",
      "Company": "The Chamberlain Group Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "edeba6a9-0b14-4b37-94cd-5f0e39e45dbd"
    },
    {
      "": 36,
      "Device Name": "MYQ® INTERIOR LIGHT SWITCH",
      "Type": "Residential",
      "Price": "-",
      "Category": "Remotes and Accessories",
      "Purpose": "Lighting  Control",
      "Function": "Get smartphone control for home lighting.",
      "Company": "The Chamberlain Group Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "43f8b2a6-91c8-4484-81ad-333fe329fcc3"
    },
    {
      "": 37,
      "Device Name": "Eve Cam",
      "Type": "Residential",
      "Price": "-",
      "Category": "Security",
      "Purpose": "Remote/Streaming Camera",
      "Function": "Keep a close eye on your home around the clock.",
      "Company": "EveHome",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "122 x 65 x 60 mm",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "b66ec469-e126-4751-a6e1-e55d97d0fb1d"
    },
    {
      "": 38,
      "Device Name": "Eve Window Guard",
      "Type": "Residential",
      "Price": "€ 149.94",
      "Category": "Security",
      "Purpose": "",
      "Function": "Know the status of your window. Be notified of suspicious activity. And easily trigger automations throughout your home.",
      "Company": "EveHome",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "135 x 26 x 9 mm",
      "Installation Type": "Indoors",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "1ee9e7b2-3586-4109-9def-076eccad7c9c"
    },
    {
      "": 39,
      "Device Name": "Eve Motion",
      "Type": "Residential",
      "Price": "€ 49.95",
      "Category": "Security",
      "Purpose": "Motion Sensor",
      "Function": "Let your presence bring your home to life. With Eve Motion, cue the perfect ambiance upon entry, and know of activity as it’s happening.",
      "Company": "EveHome",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "80 x 80 x 32 mm",
      "Installation Type": "Indoors",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "a5692881-5bd6-46ac-84ea-6a84b81ff816"
    },
    {
      "": 40,
      "Device Name": "Eve Smoke",
      "Type": "Residential",
      "Price": "€ 141.00",
      "Category": "Security",
      "Purpose": "",
      "Function": "Meet Eve Smoke: a HomeKit-enabled smoke and heat detector created in collaboration with Hager. A connected alarm that puts vital information in the palm of your hand, so you can put your mind at ease.",
      "Company": "EveHome",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "116 x 49 mm",
      "Installation Type": "Indoors",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "9e4a3cc7-36e8-4343-b2e2-af354c20f05a"
    },
    {
      "": 41,
      "Device Name": "Eve Aqua",
      "Type": "Residential",
      "Price": "€ 99.95",
      "Category": "Outdoor",
      "Purpose": "Water sensor",
      "Function": "Water your garden and patio plants automatically with the Eve Aqua smart water controller.",
      "Company": "EveHome",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "3.7 x 5.2 x 3.1 in",
      "Installation Type": "Exposed",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "827fdefd-100e-4538-bcf9-991b60aa7e00"
    },
    {
      "": 42,
      "Device Name": "Eve Degree",
      "Type": "Residential",
      "Price": "€ 69.95",
      "Category": "Outdoor",
      "Purpose": "Weather Sensor",
      "Function": "Intelligent weather monitoring seamlessly integrated into your daily life. Precise measurements forever a glance away, and enlightening insights always at your fingertips.",
      "Company": "EveHome",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "2.1 x 2.1 x 0.6 in",
      "Installation Type": "Exposed",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "e064754a-f9ab-4ab2-b037-3efa8967a5a9"
    },
    {
      "": 43,
      "Device Name": "Eve Motion",
      "Type": "Residential",
      "Price": "€ 49.95",
      "Category": "Outdoor",
      "Purpose": "Motion Sensor",
      "Function": "Let your presence bring your home to life. With Eve Motion, cue the perfect ambiance upon entry, and know of activity as it’s happening.",
      "Company": "EveHome",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "80 x 80 x 32 mm",
      "Installation Type": "Indoors",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "e3afc08c-9733-4a78-bc68-e33facb7570f"
    },
    {
      "": 44,
      "Device Name": "Eve Thermo",
      "Type": "Residential",
      "Price": "€ 69.95",
      "Category": "Heat and Comfort",
      "Purpose": "Temp Control",
      "Function": "Control your room temperature with ease using the app, Siri, schedules, or based on your presence.",
      "Company": "EveHome",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "54 x 67 x 85 mm",
      "Installation Type": "Indoors",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "5dab619c-da3c-401c-ac75-ea4d043a0905"
    },
    {
      "": 45,
      "Device Name": "Eve Light Strip",
      "Type": "Residential",
      "Price": "€ 79.95",
      "Category": "Lighting",
      "Purpose": "LIghting  Control",
      "Function": "Epitomize comfort and class with the most sophisticated HomeKit-enabled LED strip ever. Perfected to produce true-to-life colors on command, Eve Light Strip doesn’t only put the brightest, most beautiful palette at your fingertips.",
      "Company": "EveHome",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "0.59 x 0.16 in",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "ca3c91b7-f318-4ca7-b9cc-fdc9a2eb7deb"
    },
    {
      "": 46,
      "Device Name": "T9 SMART THERMOSTAT",
      "Type": "Residential",
      "Price": "$169.00",
      "Category": "Thermostat",
      "Purpose": "Temp Control",
      "Function": "The T9 Smart Thermostat works with Smart Room Sensors to help you adjust the temperature from anywhere and stay cozy in the rooms that matter.",
      "Company": "Honeywell International Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "4.92\" x 3.7\" x 0.94",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "56df6478-5653-43d3-982a-664a4577fa76"
    },
    {
      "": 47,
      "Device Name": "F100 MEDIA AIR CLEANER",
      "Type": "Residential",
      "Price": "-",
      "Category": "Air Filtrations",
      "Purpose": "Air Cleaner",
      "Function": "You want your indoor air to be cleaner – down to a microscopic level. You also want an efficient and affordable air purifier to work throughout your home.",
      "Company": "Honeywell International Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "20 in. x 25 in.",
      "Installation Type": "Indoors",
      "Connection Type": "-",
      "System Access": "",
      "uuid": "5d7d6043-7711-4f90-b28e-3031d9b0d582"
    },
    {
      "": 48,
      "Device Name": "WHOLE HOME DEHUMIDIFIER SYSTEM",
      "Type": "Residential",
      "Price": "-",
      "Category": "Dehumidifiers",
      "Purpose": "Moisture Control",
      "Function": "The Honeywell Home Whole Home Dehumidification System works to remove moisture from your home to increase your comfort.",
      "Company": "Honeywell International Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "-",
      "System Access": "",
      "uuid": "d735bf30-919a-46ed-847b-c3f70448c4d7"
    },
    {
      "": 49,
      "Device Name": "HONEYWELL HOME HEAT RECOVERY VENTILATORS",
      "Type": "Residential",
      "Price": "-",
      "Category": "Ventilation",
      "Purpose": "Air Control",
      "Function": "The Heat Recovery Ventilator optimizes air flow in your home by exchanging stale air for fresher air.",
      "Company": "Honeywell International Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "22.5 x 29.5 x 11.5 inches",
      "Installation Type": "Indoors",
      "Connection Type": "-",
      "System Access": "",
      "uuid": "3cb188a7-7f6b-4cb5-8a54-55931fbbe2d8"
    },
    {
      "": 50,
      "Device Name": "DIGITAL BATH FAN CONTROL",
      "Type": "Residential",
      "Price": "-",
      "Category": "Ventilation",
      "Purpose": "Ventilation Control",
      "Function": "Make sure your bathroom fan operations meet ASHRAE 62.2 ventilation standards with the Digital Bath Fan Control. The control replaces a normal bathroom switch to provide simple programming.",
      "Company": "Honeywell International Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "-",
      "System Access": "",
      "uuid": "a43d52e1-18bc-47e7-8d87-b5108fcc6b31"
    },
    {
      "": 51,
      "Device Name": "SMART HOME SECURITY STARTER KIT",
      "Type": "Residential",
      "Price": "$449.00",
      "Category": "Security Systems",
      "Purpose": "Multi Purpose Montioring",
      "Function": "The Smart Home Security Starter Kit sets up in minutes so that you can keep watch from anywhere.",
      "Company": "Honeywell International Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "7.3 x 3.6 x 3.6 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "5551062d-bcd7-453a-9bd8-3ff02c233fd4"
    },
    {
      "": 52,
      "Device Name": "4G LTE MULTI-PATH COMMUNICATOR",
      "Type": "Residential",
      "Price": "-",
      "Category": "Security Systems",
      "Purpose": "Multi Purpose Communication",
      "Function": "This multi-path communicator provides IP compatibility and 4G LTE cellular network transmission paths for added flexibility and reliability in your smart home alarm system.",
      "Company": "Honeywell International Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "1f4fa679-294f-4185-88fa-9f4fa85e677c"
    },
    {
      "": 53,
      "Device Name": "WIRED AND WIRELESS COLOR OUTDOOR IP CAMERA",
      "Type": "Residential",
      "Price": "-",
      "Category": "Security Systems",
      "Purpose": "Remote/Streaming Camera",
      "Function": "This weather-resistant camera is compatible with home security and automation systems and allows for live video streaming of outdoor areas around homes or businesses.",
      "Company": "Honeywell International Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Exposed",
      "Connection Type": "WiFi, Wired",
      "System Access": "",
      "uuid": "edab7f80-34a5-4dce-8712-166e91c7fc3b"
    },
    {
      "": 54,
      "Device Name": "SERIES 9 DOORBELL",
      "Type": "Residential",
      "Price": "$49.99",
      "Category": "Doorbells",
      "Purpose": "Doorbell",
      "Function": "With the Series 9 Portable Wireless Doorbell and Push Button, you're never out of earshot when a guest or package arrives.",
      "Company": "Honeywell International Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "4.96 x 4.96 x 1.65 inches",
      "Installation Type": "Indoors",
      "Connection Type": "Wired",
      "System Access": "",
      "uuid": "a23c7623-686e-4b5e-86bb-3857b2254067"
    },
    {
      "": 55,
      "Device Name": "The Keen Zoning System",
      "Type": "Residential",
      "Price": "$389",
      "Category": "Smart Vents",
      "Purpose": "Air Control",
      "Function": "Smart Vents™ adjust airflow to over-conditioned rooms and redirect this airflow to rooms that need it most.",
      "Company": "Keen Home Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "4\"x10",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "c642842e-1bb2-4093-97ef-ffbbd259dfac"
    },
    {
      "": 56,
      "Device Name": "LG HOM-BOT™ Turbo+ Robotic Smart wi-fi Enabled Vacuum",
      "Type": "Residential",
      "Price": "$999.99",
      "Category": "Vacuum Cleaners",
      "Purpose": "",
      "Function": "LG Hom-Bot is a truly intelligent robotic vacuum with wi-fi capabilities, giving users total control using a smartphone.",
      "Company": "LG Electronics",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "13.39\" x 3.5\" x 13.39",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "bb21aeb3-287a-44f5-b3a3-ff58de97c0c8"
    },
    {
      "": 57,
      "Device Name": "8,000 BTU Smart wi-fi Enabled Window Air Conditioner",
      "Type": "Residential",
      "Price": "$299.00",
      "Category": "Air Conditioners",
      "Purpose": "Temp Control",
      "Function": "With the SmartThinQ™ app, you can start or stop your LG air conditioner, change the mode, or set the temperature, no matter where you are. You can also use simple voice commands via Google Assistant and Amazon Alexa.",
      "Company": "LG Electronics",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "19.57 x 12.36 x 19.37 inch",
      "Installation Type": "Indoors",
      "Connection Type": "-",
      "System Access": "",
      "uuid": "6929f0c0-e22d-4fc6-8c03-bd193b6562e9"
    },
    {
      "": 58,
      "Device Name": "Nespresso D70-US-SI-NE Prodigio",
      "Type": "Commercial",
      "Price": "$349.00",
      "Category": "Kitchen",
      "Purpose": "",
      "Function": "Nespresso, the pioneers of single-serve coffee, brings coffee-making to your fingertips. Your phone can now make a perfect coffee. The Prodigio is the first Nespresso machine that is connected via Bluetooth smart technology to your mobile device (iOS smartphones and iPads and Android smartphones) so you can manage your capsule stock, schedule a brew time, brew remotely, get machine assistance alerts and seamlessly register your machine into the Nespresso Club.",
      "Company": "Nespresso",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "10.1 x 4.7 x 14.7 inches",
      "Installation Type": "Indoors",
      "Connection Type": "Bluetooth",
      "System Access": "",
      "uuid": "89c0e95a-ece3-4cfe-9264-a530e89268cf"
    },
    {
      "": 59,
      "Device Name": "Smart Indoor Security Camera - Netatmo Welcome",
      "Type": "Residential",
      "Price": "$174.34",
      "Category": "Security Systems",
      "Purpose": "",
      "Function": "Receive home intruder alerts direct to your smartphoneWelcome is a new-generation smart indoor security camera. Unlike the usual motion alerts which require you to waste time watching footage, Welcome sends an immediate alert if an intruder has been detected in your home, complete with a picture of the person's face and a video recording.",
      "Company": "NETATMO LLC",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "1.8 x 1.8 x 6 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "a7e02d13-2f4c-4603-9015-8f63973d89db"
    },
    {
      "": 60,
      "Device Name": "Neurio Home Energy Controller",
      "Type": "Residential",
      "Price": "-",
      "Category": "Home Energy Controller",
      "Purpose": "Utility Controller",
      "Function": "A powerful, flexible solution that allows for communication and control of PV and storage systems, as well as the Neurio Energy Monitor.",
      "Company": "Neurio",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "3.6” (91mm) x 1.1” (28mm) x 4.2” (106mm)",
      "Installation Type": "Exposed",
      "Connection Type": "WiFi, Wired",
      "System Access": "",
      "uuid": "ca7dd3f8-eea6-4d74-bf00-6981b951edbc"
    },
    {
      "": 61,
      "Device Name": "Neurio Energy Monitor",
      "Type": "Residential",
      "Price": "-",
      "Category": "Home Energy Monitor",
      "Purpose": "Utility Montor",
      "Function": "The Neurio Home Energy Monitor installs easily within the home's load panel and provides extremely granular energy data that is used to reduce energy usage, monitor solar performance and plan for future storage needs.",
      "Company": "Neurio",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Wired",
      "System Access": "",
      "uuid": "7a2da56a-4d6c-42e3-b317-3e2792e4f99e"
    },
    {
      "": 62,
      "Device Name": "Schlage Sense™ Smart Deadbolt with Camelot trim",
      "Type": "Residential",
      "Price": "$229.00",
      "Category": "Security Systems",
      "Purpose": "Smart Locks",
      "Function": "The Schlage Sense Smart Deadbolt with Camelot Trim in Satin Nickel makes daily life easier and more convenient. Enter an access code on the touchscreen to unlock the door instead of searching your pockets for keys.",
      "Company": "Schlage",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "5 x 3 x 1 inches",
      "Installation Type": "Indoors",
      "Connection Type": "-",
      "System Access": "",
      "uuid": "310898c7-9d14-485d-882d-46f65b971b27"
    },
    {
      "": 63,
      "Device Name": "Sonos Five",
      "Type": "Residential",
      "Price": "$499",
      "Category": "Entertainment",
      "Purpose": "",
      "Function": "Experience vividly clear, room-filling sound for music streaming, vinyl, and more.",
      "Company": "Sonos Inc.",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "8.03 x 14.33 x 6.06 in.",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Wired",
      "System Access": "",
      "uuid": "7f7c7b49-a286-4167-a26d-b47eb871654c"
    },
    {
      "": 64,
      "Device Name": "Wink Bright",
      "Type": "Residential",
      "Price": "$129",
      "Category": "Starter Kits",
      "Purpose": "Lighting  Control",
      "Function": "Wink empowers you to stay connected to your home no matter where you are, while keeping your house and family safe.",
      "Company": "WINK LABS INC",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Wired",
      "System Access": "",
      "uuid": "37107b5a-ca12-4978-84de-aa4c6b288054"
    },
    {
      "": 65,
      "Device Name": "DOME LEAK SENSOR",
      "Type": "Residential",
      "Price": "$169.00",
      "Category": "Leak Protection Kits",
      "Purpose": "Water sensor",
      "Function": "Use the Dome Leak Sensor with your Wink Hub and save thousands of dollars by preventing water damage. Receive an alert and turn off your water main when an appliance malfunctions, the toilet leaks, or the pump starts to overflow.",
      "Company": "WINK LABS INC",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "2.63\" x 2.63\" x 1",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "f4322f1a-28f0-4220-9c73-6e97e105b934"
    },
    {
      "": 66,
      "Device Name": "DOME WATER MAIN SHUT-OFF",
      "Type": "Residential",
      "Price": "$169.00",
      "Category": "Leak Protection Kits",
      "Purpose": "Water Senor Controller",
      "Function": "Turn off your water automatically when leaks are detected or when you travel out of town. The Water Main Shut-Off can even automate your water heater or anything else that uses a quarter-turn ball valve.",
      "Company": "WINK LABS INC",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": ".25\" x 3.5\" x 6",
      "Installation Type": "Indoors",
      "Connection Type": "WiFI",
      "System Access": "",
      "uuid": "74bfb0b4-4cb8-4047-9010-3c04c30d1f7e"
    },
    {
      "": 67,
      "Device Name": "WINK HUB",
      "Type": "Residential",
      "Price": "$69.00",
      "Category": "Wink Lookout",
      "Purpose": "Network Hub",
      "Function": "The Wink Hub allows your diverse collection of smart products to speak the same wireless language, so that you can easily control them—and customize their interactions—from the Wink app.",
      "Company": "WINK LABS INC",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "8\" L x 3\" W x 8\" H",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "222bb2e4-8e98-4129-a899-174f52bd7440"
    },
    {
      "": 68,
      "Device Name": "Wink Motion Sensor",
      "Type": "Residential",
      "Price": "$39.00",
      "Category": "Wink Lookout",
      "Purpose": "Motion Sensor",
      "Function": "Use your Wink Motion Sensor with our free, in-app Look Out service to get alerts about motion in your home while you're away.",
      "Company": "WINK LABS INC",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "c6b2b490-c55b-49fe-b132-080c6cb99ee9"
    },
    {
      "": 69,
      "Device Name": "WINK SIREN AND CHIME",
      "Type": "Residential",
      "Price": "$39.00",
      "Category": "Wink Lookout",
      "Purpose": "Motion Sensor",
      "Function": "Easily control your Wink Siren & Chime using the Wink app. Include it in our free, in-app Look Out service to sound the siren or flash the in-built light if your motion or door/window sensors detect activity.",
      "Company": "WINK LABS INC",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "4d965ca0-014d-47f0-a46f-dc472a1905cc"
    },
    {
      "": 70,
      "Device Name": "SYLVANIA SMART CONNECTED LIGHTING",
      "Type": "Residential",
      "Price": "$30.00",
      "Category": "Lighting",
      "Purpose": "Lighting  Control",
      "Function": "LED bulb tunable between Soft White and Daylight White (2700-6500 Kelvin).",
      "Company": "Sylvania",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "4.33 X 2.36 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "eecde8c3-8663-4daa-b5de-f7beae6c5a9a"
    },
    {
      "": 71,
      "Device Name": "RING VIDEO DOORBELL",
      "Type": "Residential",
      "Price": "$199.00",
      "Category": "Security Systems",
      "Purpose": "",
      "Function": "With Wink + Ring you can turn on lights or unlock the front door when visitors approach your home.",
      "Company": "Ring",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "4.98 in. x 2.43 in x .087 in.",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "ae9ee3e9-7eb8-46cd-87b8-5537b755b3f0"
    },
    {
      "": 72,
      "Device Name": "KIDDE SMOKE AND CO ALARM",
      "Type": "Residential",
      "Price": "$50.00",
      "Category": "Security Systems",
      "Purpose": "",
      "Function": "Always know what's going on at home with mobile alerts from Wink. This Kidde smoke and carbon monoxide detector notifies you the moment it senses a potential danger.",
      "Company": "Kidde",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "5.7\" W x 1.75\" H x 5.7\" D",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "ed3ddefd-2bca-4c14-9af5-46180d338e26"
    },
    {
      "": 73,
      "Device Name": "ANDERSEN VERILOCK SECURITY SENSORS",
      "Type": "Residential",
      "Price": "-",
      "Category": "Security Systems",
      "Purpose": "",
      "Function": "VeriLock® Security Sensors not only tell you if a window or patio door is open, but also if it’s unlocked. No other sensors can do that.",
      "Company": "Andersen",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "a7ae460e-bc53-4b18-ae9a-eeb56d589d70"
    },
    {
      "": 74,
      "Device Name": "Andersen Translator",
      "Type": "Residential",
      "Price": "-",
      "Category": "Security Systems",
      "Purpose": "Network Hub",
      "Function": "Andersen's Translator is required for VeriLock Security Sensors and Wireless Open/Closed Sensors. It's your home automation hub for compatible security or home automation systems.",
      "Company": "Andersen",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "fe99dc6f-abb0-4250-8c73-3493e7f2c33f"
    },
    {
      "": 75,
      "Device Name": "Dome Motion Detector",
      "Type": "Residential",
      "Price": "-",
      "Category": "Security Systems",
      "Purpose": "Motion Sensor",
      "Function": "The Dome Motion Detector will notify you of movement where it shouldn’t be, or automatically turn lights on when you enter the room, the flexible magnetic mount allows for countless installation options.",
      "Company": "Dome",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "1.8\" x 1.8\" x 1.8",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "f5e02461-21b5-4b0d-a544-8f94d26d93e1"
    },
    {
      "": 76,
      "Device Name": "KWIKSET SMARTCODE 910 CONTEMPORARY ELECTRONIC DEADBOLT",
      "Type": "Residential",
      "Price": "$199.00",
      "Category": "Security Systems",
      "Purpose": "Smart Locks",
      "Function": "The Kwikset Contemporary Electronic Deadbolt simplifies home security while offering a modern door lock design to match. Exchange your keys for a personalized code, and control and monitor the lock's status from anywhere.",
      "Company": "Kwikset",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "3.2\" W x 6.4\" H x 1.75\" D",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "5a7dbe5d-b700-4aa8-afc9-8d2bbad9ba84"
    },
    {
      "": 77,
      "Device Name": "YALE KEY FREE TOUCHSCREEN DEADBOLT",
      "Type": "Residential",
      "Price": "-",
      "Category": "Security Systems",
      "Purpose": "",
      "Function": "Yale's Key Free Touchscreen Lock allows you to experience the highest-rated level of home security with a key free deadbolt you can monitor and control from anywhere.",
      "Company": "Yale",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "6.1 x 1.3 x 6.1 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "1664fefe-cea2-4a36-8dda-421e873a41c6"
    },
    {
      "": 78,
      "Device Name": "RACHIO IRO IRRIGATION CONTROLLER",
      "Type": "Residential",
      "Price": "$149.00",
      "Category": "IoT Garden Equipment",
      "Purpose": "Water Senor Controller",
      "Function": "This smart sprinkler controller lets you set and monitor your watering schedule from anywhere. It even accounts for weather and seasonality for optimum water usage.",
      "Company": "Rachio",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "10.4\" L x 7.7\" W x 3.2\" D",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "f766b40c-afc6-4aaa-a009-2d70ad9c5b48"
    },
    {
      "": 79,
      "Device Name": "RHEEM ECONET WATER HEATERS",
      "Type": "Residential",
      "Price": "$578.00",
      "Category": "Appliances",
      "Purpose": "Temp Control",
      "Function": "Rheem EcoNet Water Heaters offer affordable water heating solutions for households of any size that you can connect to and control from anywhere.",
      "Company": "Rheem",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "ba83f425-d5c0-4eeb-9bc5-a7e4c7deb2ee"
    },
    {
      "": 80,
      "Device Name": "GARDINIER WINK ENABLED CEILING FAN",
      "Type": "Residential",
      "Price": "-",
      "Category": "Appliances",
      "Purpose": "",
      "Function": "The Gardinier ceiling fan is a revolutionary advancement in home comfort. Utilizing Wink technology, you can connect and control your fan from anywhere via the Wink app.",
      "Company": "Home Decorators Collection",
      "Data Type": "Home",
      "Device Security": "-",
      "Dimensions": "52 x 15.4 inches",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "66d4f676-0e1d-4e1c-8d6e-81ec68ddbf72"
    },
    {
      "": 81,
      "Device Name": "LUTRON SERENA SHADES",
      "Type": "Residential",
      "Price": "-",
      "Category": "Window Treatments",
      "Purpose": "",
      "Function": "Serena motorized shades give you instant access to your window treatments so you can control privacy and adjust natural light with the touch of a button.",
      "Company": "Lutron",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "60e70ef1-8544-4a8f-a9f9-877146935aaf"
    },
    {
      "": 82,
      "Device Name": "PELLA INSYNCTIVE MOTORIZED BLINDS AND SHADES",
      "Type": "Residential",
      "Price": "-",
      "Category": "Window Treatments",
      "Purpose": "",
      "Function": "Pella Between-the-Glass Blinds and Shades with Insynctive Technology + WINK allow you to automatically control natural light, comfort and privacy from virtually anywhere using a smartphone, tablet or computer.",
      "Company": "Pella",
      "Data Type": "Consumer",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "3d50d6ce-ba44-4f42-a2f8-270ac76ef4a0"
    },
    {
      "": 83,
      "Device Name": "AK11",
      "Type": "Industrial",
      "Price": "-",
      "Category": "GPS Tracking",
      "Purpose": "",
      "Function": "AK11 is a versatile multi-functional telematics device that is capable of data communication via 4G LTE network with 3G fallback in US, and 2G fallback in Euro. It is ideal for the Transportation industry and various fleet applications, and includes interfaces for OBDII, J1939, and J1708, as well as a wide range of sensor monitoring and output trigger capabilities.",
      "Company": "ATRACK TECHNOLOGY INC.",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "5.98\" x 3.86\" x 1.18",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "ebbfddfa-c77b-4c7a-acbc-9053e9c6a785"
    },
    {
      "": 84,
      "Device Name": "AU7",
      "Type": "Industrial",
      "Price": "-",
      "Category": "GPS Tracking",
      "Purpose": "",
      "Function": "AU7 is the most advanced GPS/GLONASS vehicle tracking device that using CDMA/UMTS/HSPA mobile communication technology, with the flexibility of custom reporting mechanism for advanced users. It also gives the option of saving communication costs while keep the administrator to know the vehicle’s whereabouts in real time. In addition, the external accessory compatibilities, such as RS-232, CAN Bus interpreter, and 1-Wire®, give more options to meet all your project needs.",
      "Company": "ATRACK TECHNOLOGY INC.",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Wired",
      "System Access": "",
      "uuid": "31bfe5d6-7a97-4acb-bda2-3a93752176f9"
    },
    {
      "": 85,
      "Device Name": "AX11",
      "Type": "Industrial",
      "Price": "-",
      "Category": "GPS Tracking",
      "Purpose": "",
      "Function": "AX11 is a 4G LTE Cat.1/Cat.M1 GPS tracking unit with OBDII Interface and plug-n-play installation.",
      "Company": "ATRACK TECHNOLOGY INC.",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "3.31\" x 2.05\" X 0.98",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "3cb8f8af-de07-4825-ad79-8c1892350e71"
    },
    {
      "": 86,
      "Device Name": "AP1",
      "Type": "Industrial",
      "Price": "-",
      "Category": "GPS Tracking",
      "Purpose": "",
      "Function": "AP1 is a Cigar Lighter GPS Tracker that offers plug & go installation and is universally compatible with gasoline, hybrid, and electric vehicles. In addition to real-time location tracking and reporting via options of 2G and 3G cellular technology, AP1 also has built-in G-sensor for the capability to monitor and detect motion and impact events.",
      "Company": "ATRACK TECHNOLOGY INC.",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "b795129f-c3dd-434c-bdc4-d531586946fd"
    },
    {
      "": 87,
      "Device Name": "AL7",
      "Type": "Industrial",
      "Price": "-",
      "Category": "GPS Tracking",
      "Purpose": "",
      "Function": "AL7 is an economical fleet tracking unit realizing real-time track and trace with easy installation. Featuring IP66 waterproof casing, internal antenna, I/O connectivity, driving behavior event management, and user-defined reports, AL7 is an ideal solution for Motorcycle Tracking, Fleet Management, Car Rental, and Small & Medium-Sized Enterprises.",
      "Company": "ATRACK TECHNOLOGY INC.",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "3.46\" x 2.56\" x 0.98",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "8ed92d39-bbcb-4d6d-ad66-e64e7eea05b5"
    },
    {
      "": 88,
      "Device Name": "NET485-MB - Modbus RS485 Adapter",
      "Type": "Industrial",
      "Price": "-",
      "Category": "Wireless",
      "Purpose": "",
      "Function": "The NET485-MB changes a serial port using Modbus RTU/ASCII Master/Slave to a Modbus TCP Ethernet port with no changes to your software.",
      "Company": "Grid Connect Inc",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "3.1 x 1.6 x .794 in",
      "Installation Type": "Exposed",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "9b3b03d7-b045-4835-a25f-df64c06cfb14"
    },
    {
      "": 89,
      "Device Name": "WIRELESS RS485, RS232, TTL ADAPTER",
      "Type": "Industrial",
      "Price": "$99.94",
      "Category": "Wireless",
      "Purpose": "",
      "Function": "The ATC-871 is a short distance (500m/1640ft) wireless adapter for RS232, RS485, or TTL level signals. It has 8 channels and baud rates up to 38.4K. The frequency range is 429-433.30MHz and the device uses low power (max. 100mW).",
      "Company": "Grid Connect Inc",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "44 x 27 x 8 mm",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "6d0b7a6e-56ba-456a-b412-75393833019a"
    },
    {
      "": 90,
      "Device Name": "BLUETOOTH RS232 SERIAL FIREFLY PAIR",
      "Type": "Industrial",
      "Price": "$145.95",
      "Category": "Wireless",
      "Purpose": "",
      "Function": "Our Firefly Pair can replace your serial RS232 cable with a Bluetooth Class 1 wireless connection up to 100 meters (330 feet) away. Just plug them in, set the baud rate DIP switches, configure the jumpers for DTE or DCE, and you are connected!",
      "Company": "Grid Connect Inc",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "3.0\" x 1.3\" x 0.9",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "953ae5b2-fad4-4d6c-84f2-119ba547a7a7"
    },
    {
      "": 91,
      "Device Name": "WI232+ - ADVANCED RS232 SERIAL TO WI-FI ADAPTER",
      "Type": "Industrial",
      "Price": "$129.00",
      "Category": "Wireless",
      "Purpose": "",
      "Function": "The WI232+ is a single-port serial to Wi-Fi adapter that lets you connect serial devices to 802.11b/g/n wireless networks quickly and easily. The WI232+ simplifies connectivity to devices where cabling is prohibited or mobility is required.",
      "Company": "Grid Connect Inc",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "2.5\" x 1.58\" x .794",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "35d8f182-1d0f-4b54-a8f4-7d4d73bf429f"
    },
    {
      "": 92,
      "Device Name": "MBNET.MINI - COMPACT INDUSTRIAL ROUTER",
      "Type": "Industrial",
      "Price": "$550.00",
      "Category": "Wireless",
      "Purpose": "",
      "Function": "The mbNET.mini is a compact Industrial Router that offers secure remote access to PLCs, PLC to cloud data collection, and cloud data visualization, which is ideal for M2M applications.",
      "Company": "Grid Connect Inc",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "69 mm x 38,5 mm x 92,5 mm",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "0f1f4421-507a-4e5f-8d44-7661a47639e6"
    },
    {
      "": 93,
      "Device Name": "IP7-2X INTERCOM OVER IP",
      "Type": "Industrial",
      "Price": "$415.00",
      "Category": "Ethernet/IP",
      "Purpose": "",
      "Function": "IP Intercoms from Digital Acoustics provide voice-quality sound over LANs and WANs. The IP7-2x is a two-way, half-duplex intercom with a relay to provide access control for a door or gate. This intercom can be used in pairs with other Digital Acoustics intercoms, with a PC software based console, or with most SIP 2.0 based IP Phone systems.",
      "Company": "DIGITAL ACOUSTICS LLC",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "98 x 91 x 35 mm",
      "Installation Type": "Indoors",
      "Connection Type": "Wired",
      "System Access": "",
      "uuid": "3697cb9c-f4cc-4c0c-87bf-f7ff3f0a77d0"
    },
    {
      "": 94,
      "Device Name": "NETWORK INTERCOM DESKTOP MODELS",
      "Type": "Industrial",
      "Price": "$349.00",
      "Category": "Ethernet/IP",
      "Purpose": "",
      "Function": "The Network Intercom is designed for network audio communication over Ethernet or the Internet. These Network Intercoms are easy to install using existing LAN wiring and have dozens of applications.   Our Digital Intercom technology offers many advantages over analogue systems.",
      "Company": "DIGITAL ACOUSTICS LLC",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "Wired",
      "System Access": "",
      "uuid": "969ba4bb-c801-486c-ae9e-90ce36beda68"
    },
    {
      "": 95,
      "Device Name": "IP ETHERNET INTERCOM SURFACE MOUNT MODELS",
      "Type": "Industrial",
      "Price": "$359.00",
      "Category": "Ethernet/IP",
      "Purpose": "",
      "Function": "The IP Ethernet Intercom is designed for network audio communication over Ethernet or the Internet. These Network Intercoms are easy to install using existing LAN wiring, and have dozens of applications.",
      "Company": "DIGITAL ACOUSTICS LLC",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "Wired",
      "System Access": "",
      "uuid": "0d29c9a3-084d-4003-9c4c-a50d1537361c"
    },
    {
      "": 96,
      "Device Name": "ESP32-S2-WROOM - LOW-POWER WI-FI MODULE",
      "Type": "Industrial",
      "Price": "$1.99",
      "Category": "Chips Models Kits",
      "Purpose": "",
      "Function": "The ESP32-S2-WROOM is a powerful Wi-Fi module that is ideal for low-power Internet of Things (IoT) applications and wearable tech. It is designed around the reliable ESP32-S2 chip with an Xtensa® 32-bit LX7 CPU.",
      "Company": "Espressif",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "18mm x 31mm x 3.3mm",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "24d47181-bf74-4369-8137-27690bfcb15d"
    },
    {
      "": 97,
      "Device Name": "ESP32-AZURE - ESP32 DEVELOPMENT BOARD",
      "Type": "Industrial",
      "Price": "$35.00",
      "Category": "Chips Models Kits",
      "Purpose": "",
      "Function": "The Espressif ESP32-AZURE is an advanced development board integrating the ESP32-WROVER-B module with embedded ESP32-D0WD chip supporting Wi-Fi, Bluetooth (BT), and Bluetooth Low Energy (BLE) capabilities.",
      "Company": "Espressif",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "54 cm x 75 cm",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "ef82d7a4-94dd-4c7e-8322-de9bd9c2510a"
    },
    {
      "": 98,
      "Device Name": "ESP-SOLO-1 - SINGLE-CORE WI-FI/BT/BLE MODULE",
      "Type": "Industrial",
      "Price": "$3.40",
      "Category": "Chips Models Kits",
      "Purpose": "",
      "Function": "The Espressif ESP-SOLO-1 is a high-performance module built around the ESP32-S0WD chip and capable of supporting Wi-Fi, Bluetooth (BT), and Bluetooth Low Energy (BLE).",
      "Company": "Espressif",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "18 mm x 25.5 mm x 3.1 mm",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi, Bluetooth",
      "System Access": "",
      "uuid": "5471a732-bf14-4e11-89f6-75126fbafd0c"
    },
    {
      "": 99,
      "Device Name": "ESPRESSIF ESP32 TOUCH SENSOR KIT",
      "Type": "Industrial",
      "Price": "$50.00",
      "Category": "Chips Models Kits",
      "Purpose": "",
      "Function": "The ESP32-Sense Kit is used for evaluating and developing the touch-sensing functionality of the ESP32 chip. The kit consists of a motherboard with display and several daughterboards that can be used for different application scenarios.",
      "Company": "Espressif",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "-",
      "System Access": "",
      "uuid": "2d6255c5-80c8-4a79-ad2f-b97cf3ea7ccb"
    },
    {
      "": 100,
      "Device Name": "ESPRESSIF ESP32 LYRATD MSC KIT",
      "Type": "Industrial",
      "Price": "$55.00",
      "Category": "Chips Models Kits",
      "Purpose": "",
      "Function": "The ESP-LyraTD-MSC is an innovative audio development board designed for smart speakers and AI applications. This device offers a wide-range of applications and utilizes cloud-on-demand services, including voice and image recognition as well as real-time feedback for smart home devices.",
      "Company": "Espressif",
      "Data Type": "Industrial",
      "Device Security": "-",
      "Dimensions": "-",
      "Installation Type": "Indoors",
      "Connection Type": "WiFi",
      "System Access": "",
      "uuid": "b826aa9b-1e3f-4254-8ab5-5dc26ba34329"
    }
  ]
// Put the things into the DOM!
ReactDOM.render(<App />, document.getElementById('root'));
