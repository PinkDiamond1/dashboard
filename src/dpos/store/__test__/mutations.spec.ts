import "mocha"
import { DPOSState, DPOSConfig } from "../types"
import BN from "bn.js"
import { defaultState } from "../helpers"
import sinon from "sinon"
import { setConfig, setElectionTime } from "../mutations"
import StageConfig from "../../../config/stage"
import ProdConfig from "../../../config/production"
import DevConfig from "../../../config/dev"
import localConfig from "../../../config/local"
import { expect } from "chai"
import { DPOS3 } from "loom-js/dist/contracts"

describe.only("DPOS store, Mutations", () => {
  describe("setConfig", () => {
    let state: DPOSState
    let config: DPOSConfig
    const bootStrapNodes = {
      stageNode: StageConfig.dpos.bootstrapNodes,
      prodNode: ProdConfig.dpos.bootstrapNodes,
      devNode: DevConfig.dpos.bootstrapNodes,
      localNode: localConfig.dpos.bootstrapNodes,
    }

    before(() => {
      state = defaultState()
    })

    it("bootstrapNodes state array should have a member [stage]", () => {
      config = {
        bootstrapNodes: bootStrapNodes.stageNode,
      }
      setConfig(state, config)
      // tslint:disable-next-line: no-unused-expression
      expect(state.bootstrapNodes.length > 0).to.be.true
    })

    it("bootstrapNodes state array should have a member [production]", () => {
      config = {
        bootstrapNodes: bootStrapNodes.prodNode,
      }
      setConfig(state, config)
      // tslint:disable-next-line: no-unused-expression
      expect(state.bootstrapNodes.length > 0).to.be.true
    })

    it("bootstrapNodes state array should empty [develop]", () => {
      config = {
        bootstrapNodes: bootStrapNodes.devNode,
      }
      setConfig(state, config)
      // tslint:disable-next-line: no-unused-expression
      expect(state.bootstrapNodes).to.be.empty
    })

    it("bootstrapNodes state array should empty [local]", () => {
      config = {
        bootstrapNodes: bootStrapNodes.localNode,
      }
      setConfig(state, config)
      // tslint:disable-next-line: no-unused-expression
      expect(state.bootstrapNodes).to.be.empty
    })
  })

  describe("setElectionTime", () => {
    let state: DPOSState
    // 'time' measure in second
    let time: BN
    let electionTime: any
    const dpos3Stub = sinon.createStubInstance(DPOS3)

    before(async () => {
      state = defaultState()

    })

    it("Election Time should be a next 2 minutes", () => {
      const nowTime = new Date(Date.now())
      // set next election time to be a next 2 minutes
      time = new BN(120)
      dpos3Stub.getTimeUntilElectionAsync.resolves(time)
      electionTime = Date.now() + time.toNumber() * 1000
      setElectionTime(state, new Date(electionTime))
      expect(state.electionTime.getMinutes() - nowTime.getMinutes()).to.equals(2)
    })

    it("Election time loading in state should be FALSE after set election time", () => {
      time = new BN(0)
      dpos3Stub.getTimeUntilElectionAsync.resolves(time)
      electionTime = Date.now() + time.toNumber() * 1000
      setElectionTime(state, new Date(electionTime))
    // tslint:disable-next-line: no-unused-expression
      expect(state.loading.electionTime).to.false
    })
  })
})
