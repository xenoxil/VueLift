import { createStore } from 'vuex';

export default createStore({
  state: {
    floors: 5,
    shafts: 1,
    liftCallStack: [],
    floorButtonActive: [],
    liftOnFloor: [1],
    liftPosition: [
      {
        transition: 'all 3s linear 0s',
        transform: 'translateY(0px)',
      },
    ],
    isLiftDirectionUp: [true],
    isLiftFree: [true],
    isLiftRest: [false],
    setupFloors: 5,
    setupShafts: 1,
    setupError: null,
  },
  getters: {
    getSetupFloors(state){
        return state.floors
    }
  },
  mutations: {
    setFloors(state,floors){ 
        state.floors=floors;
    },
    setShafts(state,shafts){
        debugger
        state.shafts=shafts;
    },
    setLiftOnFloor(state,value){
        state.liftOnFloor.push(value);
    },
    setLiftPosition(state) {
        for (let i = 0; i < state.liftOnFloor.length; i++) {
          state.liftPosition[i] = {
            transition: `all 1s linear 0s`,
            transform: `translateY(${100 - state.liftOnFloor[i] * 100}px)`,
          };
        }
      },
    setLiftDirection(state,newValue){
        state.isLiftDirectionUp.push(newValue);
    },
    setIsLiftRest(state,newValue){
        state.isLiftRest.push(newValue)
    } ,
    setIsLiftFree(state,newValue){
        state.isLiftFree.push(newValue)
    } ,
    setLiftCallStack(state){
        state.liftCallStack.shift()
    },  

    updateModel(state) {
        if (state.shafts > state.liftOnFloor.length) {
          for (state.liftOnFloor.length; state.liftOnFloor.length < state.shafts; ) {
            commit('setLiftOnFloor');
            commit('liftPosition');
            commit('setLiftDirection',true);
            commit('setIsLiftFree',true);
            commit('setIsLiftRest',false);
          }
        } else if (state.shafts < state.liftOnFloor.length) {
          state.liftOnFloor.splice(state.shafts, 12);
          state.liftPosition.splice(state.shafts, 12);
          state.isLiftDirectionUp.splice(state.shafts, 12);
          state.isLiftFree.splice(state.shafts, 12);
          state.isLiftRest.splice(state.shafts, 12);
        }
      },
    
    
    
    makeSetup(state) {
        
        if (1 < state.setupFloors && state.setupFloors <= 99 && 0 < state.setupShafts && state.setupShafts <= 12) {
            state.setupError = null;
            state.shafts = state.setupShafts;
            state.floors = state.setupFloors;
            state.liftOnFloor = state.liftOnFloor.map((onFloor) => {
              state;
              return onFloor > state.floors ? 1 : onFloor;
            });
          } else {
            state.setupError="Ошибка: Допустимы только 2-99 этажей и 1-12 лифтов"
            
          }
        
      },
  },
  actions: {
    getPreviousState({commit,state}) { 
        commit('setFloors', Number(localStorage.getItem('floors'))); 
        commit('setShafts',Number(localStorage.getItem('shafts')));
        (commit('setLiftOnFloor',localStorage
          .getItem('liftOnFloor')
          .split(',')
          .map((value) => Number(value)))),
          (commit('setLiftCallStack',localStorage.getItem('liftCallStack').split(','))),
        commit('setLiftPosition');
        
        commit('updateModel');
        if (state.liftCallStack[0] === '') {
          commit('setLiftCallStack');
        }
        if (state.liftCallStack[0]) {
          state.moveLiftToFloor(state.liftCallStack[0], state.findClosestFreeLift(state.liftCallStack[0]));
        }
      },
  },
});
