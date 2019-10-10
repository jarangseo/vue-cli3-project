import _ from 'lodash'

export const common = {
  nextVersion (deployedVersions) {
    return deployedVersions.length ? _.maxBy(deployedVersions, 'version').version + 1 : 1
  },
  isDeployversion (info, deployedVersion) {
    return !info.nowDeployedVersion.draft && info.nowDeployedVersion.versionNo === deployedVersion.versionNo
  },
  getCodeColumnName (columns, key) {
    const index = _.findIndex(columns, (o) => { return o.physicalName === key })
    return columns[index] && columns[index].logicalName
  },
  lastObjectKey (codes) {
    return Object.keys(codes)[Object.keys(codes).length - 1]
  },
  checkLongText (text, length) {
    text = text || ''
    return text.length > length
  },
  strMasterReference (column) {
    let str = `${column.reference.refEventDataDesignName} > ${column.reference.refAvailable ? column.reference.refLogicalColumnName : column.reference.refPhysicalColumnName}`
    if (column.dataType === 'CODE') {
      str += ` > ${column.defaultValue}`
    }
    return str
  },
  layerPopupToggle (thisComponent, name) {
    const clickId = `layerPopupClose_${name}`
    const escId = `layerPopupCloseByESC_${name}`
    if (!thisComponent[clickId]) {
      thisComponent[clickId] = () => {
        thisComponent[name] = !thisComponent[name]
        if (!thisComponent[name]) {
          common.layerPopupRemoveEvent(thisComponent, clickId, escId)
        }
      }
      thisComponent[escId] = (event) => {
        if (event.keyCode === 27) {
          thisComponent[name] = !thisComponent[name]
          if (!thisComponent[name]) {
            common.layerPopupRemoveEvent(thisComponent, clickId, escId)
          }
        }
      }
      document.addEventListener('click', thisComponent[clickId])
      document.addEventListener('keydown', thisComponent[escId])
    }
  },
  layerPopupToggles (thisComponent, name, key) {
    const clickId = `layerPopupClose_${name}_${key}`
    const escId = `layerPopupCloseByESC_${name}_${key}`
    if (!thisComponent[clickId]) {
      thisComponent[clickId] = () => {
        thisComponent.$set(thisComponent[name], key, !thisComponent[name][key])
        if (!thisComponent[name][key]) {
          common.layerPopupRemoveEvent(thisComponent, clickId, escId)
        }
      }
      thisComponent[escId] = (event) => {
        if (event.keyCode === 27) {
          thisComponent.$set(thisComponent[name], key, !thisComponent[name][key])
          if (!thisComponent[name][key]) {
            common.layerPopupRemoveEvent(thisComponent, clickId, escId)
          }
        }
      }
      document.addEventListener('click', thisComponent[clickId])
      document.addEventListener('keydown', thisComponent[escId])
    }
  },
  layerPopupRemoveEvent (thisComponent, clickId, escId) {
    document.removeEventListener('click', thisComponent[clickId])
    document.removeEventListener('keydown', thisComponent[escId])
    thisComponent[clickId] = null
    thisComponent[escId] = null
  },
  layerPopupInClick (event) {
    event.stopPropagation()
  },
  layerPopupClose () {
    document.body.click()
  },
  pageData: {
    getPagiNationNumber: (pageData, num) => {
      return Math.ceil(pageData.pageCurrent / pageData.pageBarSize) * pageData.pageBarSize - pageData.pageBarSize + num
    },
    pageMax: (pageData) => {
      return Math.ceil(pageData.totalCount / pageData.pageSize)
    },
    goBefore: (pageData) => {
      console.log(common.pageData.getPagiNationNumber(pageData, 0))
      return common.pageData.getPagiNationNumber(pageData, 0)
    },
    goNext: (pageData) => {
      return common.pageData.getPagiNationNumber(pageData, pageData.pageBarSize + 1)
    },
    hasNext: (pageData) => {
      return common.pageData.getPagiNationNumber(pageData, pageData.pageBarSize) < common.pageData.pageMax(pageData)
    }
  },
  changeRouteQuery ({thisComponent, name, querys}) {
    const query = _.cloneDeep(thisComponent.$route.query)
    _.map(_.concat([], querys), obj => {
      query[obj.key] = obj.value
    })
    thisComponent.$router.push({name, query})
  },
  countPredifines (dataDesign) {
    return dataDesign.type === 'HEADER' || dataDesign.type === 'BASIC' || dataDesign.type === 'PLATFORM' ? '-' : (dataDesign.predefines ? dataDesign.predefines : 0)
  },
  getColumnName (thisComponent, code) {
    if (!code) {
      return ''
    } else {
      return thisComponent.dataDesign.columnList[_.findIndex(thisComponent.dataDesign.columnList, ['physicalName', code.physicalName])].logicalName
    }
  },
  openCodeGroupColumn (thisComponent, key) {
    thisComponent.$nextTick(() => {
      if (document.getElementById(`columnInput_${key}_type`)) {
        document.getElementById(`columnInput_${key}_type`).click()
        document.getElementById(`columnInput_${key}_type`).focus()
        thisComponent.$nextTick(() => {
          if (document.getElementById(`columnInput_${key}_type_opt_2`)) {
            document.getElementById(`columnInput_${key}_type_opt_2`).click()
            document.getElementById(`columnInput_${key}_type_opt_2`).focus()
          }
        })
      }
    })
  },
  indexName (thisComponent, name) {
    let rtn = name
    if (thisComponent.search.input) {
      rtn = name.replace(new RegExp(`(${thisComponent.search.input})`, 'gi'), `<span>$1</span>`)
    }
    return rtn
  },
  getDataDesignType (dataDesign) {
    return dataDesign.type === 'EVENT' || dataDesign.type === 'MASTER' ? dataDesign.type.toLowerCase() : 'common'
  },
  changeCodeGroup (thisComponent, dataDesign, physicalName) {
    const key = _.findIndex(dataDesign.columnList, ['physicalName', physicalName])
    const column = dataDesign.columnList[key]
    if (dataDesign.type !== 'MASTER' && thisComponent.$route.name === 'dataDesign.edit') {
      common.openCodeGroupColumn(thisComponent, key)
      thisComponent.closeModal ? thisComponent.closeModal() : null
    } else if (dataDesign.type === 'MASTER') {
      const query = {type: 'event', codeGroupColumn: column.reference.refPhysicalColumnName}
      thisComponent.$router.push({name: 'dataDesign.edit', params: {dataDesignId: column.reference.refEventDataDesignId}, query})
    } else {
      const query = {type: thisComponent.$route.query.type, codeGroupColumn: physicalName}
      if (Number(thisComponent.$route.query.version) >= 0) {
        query.version = thisComponent.$route.query.version
      }
      thisComponent.$router.push({name: 'dataDesign.edit', params: {dataDesignId: dataDesign.id}, query})
    }
  },
  getDataDesignColumn (dataDesign, currentColumn) {
    return dataDesign.columnList[_.findIndex(dataDesign.columnList, ['physicalName', currentColumn.physicalName])]
  },
  checkNewDeploy (dataDesign, deployedVersions) {
    if (dataDesign.targetVersion === undefined) {
      dataDesign.targetVersion = dataDesign.version
    }
    return dataDesign.targetVersion === 0 && _.maxBy(deployedVersions, 'lastUpdatedAt').version === 0
  }
}
