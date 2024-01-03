<template>
  <el-drawer
    :title="title"
    size="60%"
    :visible="show"
    :before-close="handleClose"
    class="model-drawer"
  >
    <div style="padding: 20px; overflow-y: auto;">
      <el-form ref="form" label-width="160px">
        <el-form-item label="平台">
          <el-select v-model="model.platformId" :disabled="!!model.id">
            <el-option v-for="p in platforms" :key="p.id" :value="p.id" :label="p.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="调用模型">
          <el-select v-model="model.name" clearable filterable>
            <el-option
              v-for="gm in globalModels.filter(gm => !selectedPlatform || selectedPlatform.chatProtocol === gm.platformProtocol)"
              :key="gm.uuid"
              :label="gm.name"
              :value="gm.name"
            />
          </el-select>
          <el-button type="primary" plain style="margin-left: 20px" @click="handleCreateGlobalModel">创建新条目</el-button>
          <el-alert
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >调用模型是指向上游服务器发送请求时的模型名称，该模型名称务必与官方（或中转站）保持一致。</el-alert>
        </el-form-item>
        <el-form-item label="展示名称">
          <el-select v-model="model.showName" clearable filterable>
            <el-option
              v-for="display in displayModels"
              :key="display.uuid"
              :label="display.name"
              :value="display.name"
              :disabled="display.contentType !== (isDrawPlatform ? 'Image' : 'Text')"
            />
          </el-select>
          <el-button type="primary" plain style="margin-left: 20px" @click="handleCreateDisplayModel">创建新的展示名称</el-button>
          <el-alert
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >展示名称是用于前台用户侧该模型展示的名称。通过设置展示名称，可以实现模型映射，真实模型隐藏的功能。</el-alert>
        </el-form-item>
        <el-form-item label="总结模型">
          <el-tag type="primary">{{ summarizeModel }}</el-tag>
          <el-button type="primary" plain style="margin-left: 20px" :disabled="isDrawPlatform" @click="handleEditSumarizeModel">修改</el-button>
          <el-alert
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >总结模型是指当用户采用此模型进行聊天时，使用该模型对会话进行总结。</el-alert>
          <el-alert
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >总结模型仅上面选择的调用模型有关，与当前模型无关。即，总结模型是调用模型上的一个属性</el-alert>
        </el-form-item>
        <el-form-item label="path">
          <el-input v-model="model.path" placeholder />
          <el-alert
            type="info"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >当向上游发送的请求URL不是标准的请求路径时，可以在此处设置请求路径。默认情况下每个协议的每个调用模型都有自己的path，具体请参考各AI平台官方文档。</el-alert>
          <el-alert
            type="info"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >大部分情况下，您都无需设置该值。</el-alert>
        </el-form-item>
        <el-form-item v-if="selectedPlatform && ['OpenAiChat', 'AzureOpenAiChat'].includes(selectedPlatform.chatProtocol)" label="消息协议">
          <el-radio-group v-model="model.messageStruct">
            <el-radio label="normal">普通</el-radio>
            <el-radio label="complex">复杂（如gpt-4-vision）</el-radio>
            <el-radio label="dalle">dall·e</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="model.messageStruct === 'complex'" label="图片传输方式">
          <el-select v-model="model.messageFileTransformer" placeholder="一般无需选择">
            <el-option label="Url" value="url" />
            <el-option label="Base64（不推荐）" value="base64" />
          </el-select>
          <el-alert
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >一般情况下选择url方式，仅当部署在内网，无法对公网提供接口时使用Base64的方式。注意：base64模式会极大消耗内存。</el-alert>
        </el-form-item>
        <el-form-item v-if="model.messageStruct === 'dalle'" label="图片尺寸">
          <el-select v-model="model.imageSizes" multiple clearable style="width: 100%;">
            <el-option label="1792×1024（仅Dalle3）" value="1792x1024" />
            <el-option label="1024×1792（仅Dalle3）" value="1024x1792" />
            <el-option label="1024×1024（Dalle2，Dalle3）" value="1024x1024" />
            <el-option label="512×512（仅Dalle2）" value="512x512" />
            <el-option label="256×256（仅Dalle2）" value="256x256" />
          </el-select>
          <el-alert
            type="info"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >dalle2默认512×512，其他默认1024x1024，支持多选，但目前仅第一个有效。后续支持多个（选择多个时，由用户自行决定图片生成尺寸）</el-alert>
        </el-form-item>
        <el-form-item v-if="model.messageStruct === 'dalle'" label="图片质量">
          <el-select v-model="model.imageQuality" clearable>
            <el-option label="用户自定义" value="custom" disabled />
            <el-option label="标准Standard（仅Dalle3）" value="standard" />
            <el-option label="高清HD（仅Dalle3）" value="hd" />
          </el-select>
          <el-alert
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >仅dalle3支持设置图片质量。如您使用的是dalle2，请勿选择。</el-alert>
        </el-form-item>
        <el-form-item v-if="model.messageStruct === 'dalle'" label="图片风格">
          <el-select v-model="model.imageStyle" clearable>
            <el-option label="用户自定义" value="custom" disabled />
            <el-option label="鲜艳（vivid）" value="vivid" />
            <el-option label="自然（natural）" value="natural" />
          </el-select>
          <el-alert
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >仅dalle3支持设置图片风格。如您使用的是dalle2，请勿选择。</el-alert>
        </el-form-item>
        <el-form-item v-if="model.messageStruct === 'dalle'" label="图片数量">
          <el-select v-model="model.imageNumber" clearable>
            <el-option label="用户自定义" :value="-1" disabled />
            <el-option label="1张（Dalle2，Dalle3）" :value="1" />
            <el-option v-for="n in 9" :key="n + 1" :label="(n+1) + '张（仅Dalle2）'" :value="n + 1" />
          </el-select>
          <span>（默认1张）</span>
        </el-form-item>
        <el-form-item v-if="model.id" label="状态">
          <el-tag v-if="model.state == 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
          <el-button
            :type="model.state == 1 ? 'danger' : 'success'"
            plain
            icon="el-icon-disabled"
            :disalbed="loading"
            style="margin-left: 10px"
            @click.stop="toggleEnable(model)"
          >
            {{ model.state == 1 ? '禁用' : '启用' }}
          </el-button>
        </el-form-item>
        <el-form-item label="计费方式">
          <el-select v-model="model.levelId">
            <el-option :value="1" label="扣减普通聊天积分" />
            <el-option :value="2" label="扣减高级聊天积分" />
            <el-option :value="3" label="扣减tokens" />
            <el-option :value="4" label="扣减绘画积分" />
          </el-select>
        </el-form-item>
        <el-form-item label="基础倍率">
          <el-input-number v-model="model.multiple" />
          <el-alert
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >token默认按实际使用扣减，其他默认每次扣减1积分。您可以针对不同的模型设置不同的倍率。</el-alert>
        </el-form-item>
        <template v-if="isDrawPlatform">
          <el-form-item label="出图速度">
            <el-select v-model="modelConfig.processMode" placeholder="未设置时默认为mixed" clearable style="width: 300px;">
              <el-option label="mixed（默认）" value="mixed" />
              <el-option label="turbo" value="turbo" />
              <el-option label="fast" value="fast" />
              <el-option label="relax" value="relax" />
              <el-option label="用户自定义（用户可以选择turbo、fast、relax）" value="turbo|fast|relax|mixed" />
              <el-option label="用户自定义（用户可以选择fast、relax）" value="fast|relax|mixed" />
            </el-select>
            <el-alert
              type="success"
              style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
              :closable="false"
            >当使用mixed模式时，由上游决定使用何种出图速度。当选择「用户自定义」时，由用户在界面上设定出图速度。</el-alert>
          </el-form-item>
          <!-- <el-form-item label="回调地址">
            <el-input v-model="modelConfig.webhookEndpoint" placeholder="webhook endpoint" />
          </el-form-item>
          <el-form-item label="回调密码">
            <el-input v-model="modelConfig.webhookSecret" placeholder="webhook secret" />
          </el-form-item> -->
        </template>
        <el-form-item
          v-if="modelMultiples && selectedPlatform && selectedPlatform.chatProtocol && selectedPlatform.chatProtocol.includes('Draw')"
          label="动作倍率"
        >
          <div style="border: 1px solid #DCDFE6; border-radius: 4px; padding: 10px">
            <div
              class="el-table el-table--fit el-table--border el-table--scrollable-y el-table--enable-row-hover el-table--enable-row-transition"
            >
              <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
                <tr>
                  <th><div class="cell">动作</div></th>
                  <th><div class="cell">精细倍率</div></th>
                  <th><div class="cell">turbo倍率</div></th>
                  <th><div class="cell">fast倍率</div></th>
                  <th><div class="cell">relax倍率</div></th>
                </tr>
                <tr class="el-table__row">
                  <td><div class="cell">IMAGINE</div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.imagine" :controls="false" placeholder="未设置时以基础倍率计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.turboImagine" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('turbo')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.fastImagine" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('fast')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.relaxImagine" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('relax')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                </tr>
                <tr class="el-table__row">
                  <td><div class="cell">UPSCALE</div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.upscale" :controls="false" placeholder="未设置时以基础倍率计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.turboUpscale" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('turbo')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.fastUpscale" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('fast')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.relaxUpscale" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('relax')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                </tr>
                <tr class="el-table__row">
                  <td><div class="cell">VARIATION</div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.variation" :controls="false" placeholder="未设置时以基础倍率计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.turboVariation" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('turbo')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.fastVariation" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('fast')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.relaxVariation" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('relax')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                </tr>
                <tr class="el-table__row">
                  <td><div class="cell">VARY</div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.vary" :controls="false" placeholder="未设置时以基础倍率计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.turboVary" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('turbo')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.fastVary" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('fast')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.relaxVary" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('relax')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                </tr>
                <tr class="el-table__row">
                  <td><div class="cell">ZOOMOUT</div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.zoomout" :controls="false" placeholder="未设置时以基础倍率计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.turboZoomout" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('turbo')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.fastZoomout" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('fast')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.relaxZoomout" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('relax')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                </tr>
                <tr class="el-table__row">
                  <td><div class="cell">PAN</div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.pan" :controls="false" placeholder="未设置时以基础倍率计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.turboPan" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('turbo')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.fastPan" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('fast')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.relaxPan" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('relax')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                </tr>
                <tr class="el-table__row">
                  <td><div class="cell">SQUARE</div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.square" :controls="false" placeholder="未设置时以基础倍率计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.turboSquare" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('turbo')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.fastSquare" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('fast')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.relaxSquare" :controls="false" :disabled="!modelConfig.processMode || modelConfig.processMode.indexOf('relax')=== -1" placeholder="未设置时以第一列计算" /></div></td>
                </tr>
                <tr class="el-table__row">
                  <td><div class="cell">BLEND</div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.blend" :controls="false" placeholder="未设置时以基础倍率计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.turboBlend" :controls="false" :disabled="true" placeholder="暂不支持" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.fastBlend" :controls="false" :disabled="true" placeholder="暂不支持" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.relaxBlend" :controls="false" :disabled="true" placeholder="暂不支持" /></div></td>
                </tr>
                <tr class="el-table__row">
                  <td><div class="cell">DESCRIBE</div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.describe" :controls="false" placeholder="未设置时以基础倍率计算" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.turboDescribe" :controls="false" :disabled="true" placeholder="暂不支持" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.fastDescribe" :controls="false" :disabled="true" placeholder="暂不支持" /></div></td>
                  <td><div class="cell"><el-input-number v-model="modelMultiples.relaxDescribe" :controls="false" :disabled="true" placeholder="暂不支持" /></div></td>
                </tr>
              </table>
            </div>
          </div>
          <el-alert
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          >系统会优先使用上述表格配置的动作倍率，若未设置，才会使用基础倍率。若同时配置了动作倍率和基础倍率，则基础倍率将失效。</el-alert>
          <el-alert
            v-if="selectedPlatform && ['OpenAiChat', 'AzureOpenAiChat'].includes(selectedPlatform.chatProtocol)"
            type="success"
            style="margin-top: 5px; padding: 0; padding-bottom: 5px;"
            :closable="false"
          ><a href="https://openai.com/pricing" target="_blank">OpenAI官方价格表</a>。</el-alert>
        </el-form-item>
        <template v-if="selectedPlatform && selectedPlatform.chatProtocol === 'GoApiDraw' && modelConfig.gptApiKey">
          <el-form-item label="翻译用ChatGPT BaseUrl">
            <el-input v-model="modelConfig.gptApiUrl" disabled placeholder="请前往平台详情页配置" />
          </el-form-item>
          <el-form-item label="翻译用ChatGPT Key">
            <el-input v-model="modelConfig.gptApiKey" disabled placeholder="请前往平台详情页配置" />
          </el-form-item>
          <el-form-item label="翻译用ChatGPT模型名称">
            <el-input v-model="modelConfig.model" disabled placeholder="请前往平台详情页配置" />
          </el-form-item>
          <el-form-item label="翻译Prompt">
            <el-input v-model="modelConfig.translatePrompt" disabled placeholder="请前往平台详情页配置" />
          </el-form-item>
        </template>
        <el-form-item label="备注">
          <el-input v-model="model.remark" type="textarea" :row="1" autosize />
        </el-form-item>
        <el-form-item v-if="model.createTime" label="创建时间">
          <el-input v-model="model.createTime" disabled />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="handleSave">
            {{ saving ? '操作中……' : '保 存' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div style="margin-top: 100px;">
        <el-button type="danger" icon="el-icon-delete" plain @click="handleDelete()">删除</el-button>
      </div>

    </div>
  </el-drawer>
</template>

<script>

import clip from '@/utils/clipboard' // use clipboard directly
import { updateAiModel, createAiModel, deleteAiModel, createGlobalModel, updateGlobalModel, createDisplayModel } from '@/api/aiModel.js'

export default {
  name: 'ModelDetail',
  components: { },
  props: {
    platforms: {
      type: Array,
      default: () => []
    },
    globalModels: {
      type: Array,
      default: () => []
    },
    displayModels: {
      type: Array,
      default: () => []
    },
    model: {
      type: Object,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      saving: false,
      modelConfig: {},
      modelMultiples: {}
    }
  },
  computed: {
    title() {
      return this.model.name ? (this.model.name + '模型信息') : '新建模型'
    },
    selectedPlatform() {
      if (this.model.platformId && this.platforms) {
        return this.platforms.filter(p => p.id === this.model.platformId)[0]
      }
      return null
    },
    selectedGlobalModel() {
      if (!this.selectedPlatform || !this.model.name) {
        return null
      }
      return this.globalModels.filter(gm => this.selectedPlatform.chatProtocol === gm.platformProtocol && this.model.name === gm.name)[0]
    },
    isDrawPlatform() {
      return this.selectedPlatform && ['GoApiDraw', 'EmbeddingMjProxyDraw', 'MjProxyDraw', 'AimageDraw', 'MjProxyPlusDraw'].includes(this.selectedPlatform.chatProtocol)
    },
    summarizeModel() {
      if (this.isDrawPlatform) {
        return '绘画模型不总结'
      }
      if (!this.selectedPlatform || !this.model.name) {
        return '请先选择调用模型'
      }
      if (this.selectedGlobalModel && this.selectedGlobalModel.summarizeModel) {
        return this.selectedGlobalModel.summarizeModel
      }
      if (['OpenAiChat', 'AzureOpenAiChat'].includes(this.selectedPlatform.chatProtocol)) {
        return 'gpt-3.5-turbo-16k'
      }
      return this.model.showName || this.model.name
    }
  },
  watch: {
    'model.config': {
      handler(config) {
        this.modelConfig = config ? JSON.parse(config) : {}
      }
    },
    'model.multiples': {
      handler(multiples) {
        this.modelMultiples = multiples ? JSON.parse(multiples) : {}
      }
    }
  },
  mounted() {
    // this.reload()
  },
  methods: {
    handleClose() {
      this.$emit('close')
      this.$emit('update:show', false)
    },
    handleSave() {
      this.loading = true
      this.saving = true
      if (!this.model.id) {
        createAiModel({
          id: this.model.id,
          platformId: this.model.platformId,
          name: this.model.name,
          showName: this.model.showName,
          state: 1,
          levelId: this.model.levelId,
          multiple: this.model.multiple,
          path: this.model.path,
          config: this.model.config,
          multiples: JSON.stringify(this.modelMultiples || {}),
          remark: this.model.remark,
          messageStruct: this.model.messageStruct,
          messageFileTransformer: this.model.messageFileTransformer,
          imageSizesJson: JSON.stringify(this.model.imageSizes || []),
          imageNumber: this.model.imageNumber || 1,
          imageQuality: this.model.imageQuality || '',
          imageStyle: this.model.imageStyle || ''
        }).then(() => {
          this.$message.success('操作成功！')
          this.$emit('changed')
          this.$emit('close')
        }).finally(() => {
          this.loading = false
          this.saving = false
        })
        return
      }
      updateAiModel({
        id: this.model.id,
        name: this.model.name,
        showName: this.model.showName,
        state: this.model.state,
        levelId: this.model.levelId,
        multiple: this.model.multiple,
        path: this.model.path,
        config: JSON.stringify(this.modelConfig || {}),
        multiples: JSON.stringify(this.modelMultiples || {}),
        remark: this.model.remark,
        messageStruct: this.model.messageStruct,
        messageFileTransformer: this.model.messageFileTransformer,
        imageSizesJson: JSON.stringify(this.model.imageSizes || []),
        imageNumber: this.model.imageNumber || 1,
        imageQuality: this.model.imageQuality || '',
        imageStyle: this.model.imageStyle || ''
      }).then(() => {
        this.$message.success('操作成功！')
        this.$emit('changed')
        this.$emit('close')
      }).finally(() => {
        this.loading = false
        this.saving = false
      })
    },
    toggleEnable(row) {
      this.loading = true
      this.$message.info(row.state === 1 ? '停用中……' : '启用中……')
      const state = row.state === 1 ? 2 : 1
      updateAiModel({
        id: row.id,
        name: row.name,
        showName: row.showName,
        state,
        levelId: row.levelId,
        multiple: row.multiple,
        path: row.path,
        config: row.config,
        multiples: row.multiples,
        remark: row.remark,
        messageStruct: row.messageStruct,
        messageFileTransformer: row.messageFileTransformer,
        imageSizesJson: JSON.stringify(this.model.imageSizes || []),
        imageNumber: this.model.imageNumber || 1,
        imageQuality: this.model.imageQuality || '',
        imageStyle: this.model.imageStyle || ''
      }).then(() => {
        this.$message.success(row.state === 1 ? '停用成功！' : '启用成功！')
        this.$emit('changed')
        this.model.state = state
      }).finally(() => {
        this.loading = false
      })
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    handleDelete() {
      this.$confirm('确定删除' + this.model.name + '？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'long-message',
        width: '600px',
        type: 'warning'
      }).then(async() => {
        deleteAiModel(this.model.id).then(resp => {
          console.log('resp', resp)
          this.$message.success('操作成功！')
          this.$emit('changed')
          this.$emit('close')
        })
      })
    },
    handleCreateGlobalModel() {
      this.$prompt('请输入新的调用模型名称，务必与官方或中转站一致', '创建新条目', {
        type: 'info',
        showClose: true,
        inputValue: '',
        // inputPattern: /^[\d\w\-_]+$/,
        // inputErrorMessage: '仅支持数字和字母，下划线',
        beforeClose: (action, instance, done) => {
          console.log(action, instance.inputValue)
          if (action !== 'confirm') {
            return done()
          }
          createGlobalModel({
            platformProtocol: this.selectedPlatform.chatProtocol,
            name: instance.inputValue
          }).then(resp => {
            if (resp.code === 0) {
              this.$message.success('创建成功！')
              this.globalModels.push(resp.data)
              this.model.name = instance.inputValue
              done()
            } else {
              this.$message.error('创建失败：' + resp.message)
            }
          }).catch(e => {
            console.log('创建失败：' + e)
          })
        }
      }).then(({ value }) => {
        console.debug('then', value)
      }).catch(e => {
        console.debug(e)
      })
    },
    handleCreateDisplayModel() {
      // console.log('this.$prompt', this.$prompt)
      this.$prompt('请输入新的展示名称，不可与已有名称重复', '创建新的展示名称', {
        type: 'info',
        showClose: true,
        inputValue: '',
        // inputPattern: /^[\d\w\-_]+$/,
        // inputErrorMessage: '仅支持数字和字母，下划线',
        beforeClose: (action, instance, done) => {
          console.log(action, instance.inputValue)
          if (action !== 'confirm') {
            return done()
          }
          createDisplayModel({
            name: instance.inputValue,
            contentType: this.isDrawPlatform ? 'Image' : 'Text'
          }).then(resp => {
            if (resp.code === 0) {
              this.$message.success('创建成功！')
              this.displayModels.push(resp.data)
              this.model.showName = instance.inputValue
              done()
            } else {
              this.$message.error('创建失败：' + resp.message)
            }
          }).catch(e => {
            console.log('创建失败：' + e)
          })
        }
      }).then(({ value }) => {
        console.debug('then', value)
      }).catch(e => {
        console.debug(e)
      })
    },
    handleEditSumarizeModel() {
      if (!this.selectedGlobalModel) {
        return this.$message.error('请先设置调用模型！')
      }
      const h = this.$createElement
      let value = this.summarizeModel
      const displayModels = this.displayModels.includes(dm => dm.name === 'gpt-3.5-turbo-16k') ? this.displayModels
        : this.displayModels.concat({ id: '-1', name: 'gpt-3.5-turbo-16k' })
      const children = displayModels.map(m => {
        return h('el-option', {
          props: {
            key: m.id,
            value: m.name,
            label: m.name
          }
        })
      })
      const selector = h('el-select', {
        domProps: { style: 'width: 100%;' },
        props: { value },
        on: {
          change: (v) => {
            // console.log(v, selector)
            value = v
            this.$nextTick(() => {
              selector.componentInstance.$children[0].$refs.input.value = v
            })
          }
        }
      }, children)
      const box = h('div', {}, [
        h('el-alert', {
          domProps: { style: 'margin: 5px 0; padding: 0; padding-bottom: 5px;' },
          props: {
            type: 'success',
            closable: false
          }
        }, [
          '总结模型仅支持从展示名称中选择。如未设置展示名称，请先设置。'
        ]),
        selector
      ])
      this.$msgbox({
        title: `给${this.selectedPlatform.name}平台下的${this.selectedGlobalModel.name}设置总结模型`,
        message: box,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: (action, instance, done) => {
          if (action !== 'confirm') {
            return done()
          }
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '执行中...'
          updateGlobalModel({
            uuid: this.selectedGlobalModel.uuid,
            summarizeModel: value
          }).then(resp => {
            if (resp.code === 0) {
              this.selectedGlobalModel.summarizeModel = value
              this.$message.success('设置成功！')
              done()
            } else {
              this.$message.error('设置失败！' + resp.message)
            }
          }).finally(() => {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
          })
        }
      }).catch(e => {
        console.debug(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.model-drawer ::v-deep .el-drawer__body {
  height: calc(100% - 77px);
  overflow: auto;
}
</style>
