<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="检测日期" prop="date">
        <el-date-picker clearable
          v-model="queryParams.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择检测日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="物料型号" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物料型号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="是否合格" prop="isPassed">
        <el-input
          v-model="queryParams.isPassed"
          placeholder="请输入是否合格"
          clearable
          @input="handleInput"  
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="是否合格" prop="isPassed">
        <el-select
          v-model="inputIsPassed"  
          placeholder="请选择是否合格"
          clearable
          @change="handleSelectChange"  
        >
          <el-option label="是" value="0" />
          <el-option label="否" value="1" />
          <el-option label="全部" value="null" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['monitor:aip:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['monitor:aip:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:aip:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['monitor:aip:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="aipList" @selection-change="handleSelectionChange">
      <el-table-column label="物料编码" align="center" prop="materialId" v-if="columns[25].visible" :show-overflow-tooltip="true"/>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="检测日期" align="center" prop="date" width="180" v-if="columns[0].visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测开始时间" align="center" prop="startTime" width="180" v-if="columns[1].visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测结束时间" align="center" prop="endTime" width="180" v-if="columns[2].visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="物料型号" align="center" prop="materialCode" v-if="columns[3].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="物料条码" align="center" prop="materialBarcode" v-if="columns[4].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="是否合格" align="center" prop="isPassed" v-if="columns[5].visible" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <!-- 判断 isPassed 的值，0 显示 '否'，1 显示 '是' -->
          {{ scope.row.isPassed === 0 ? '是' : '否' }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否合格" align="center" prop="isPassed" v-if="columns[5].visible" :show-overflow-tooltip="true"/> -->
      <el-table-column label="电阻项目-1值" align="center" prop="resistance1Value" v-if="columns[6].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="电阻项目-2值" align="center" prop="resistance2Value" v-if="columns[7].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="电阻项目-3值" align="center" prop="resistance3Value" v-if="columns[8].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="绝缘项目-1值" align="center" prop="insulationResistance" v-if="columns[9].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="交耐项目-1值" align="center" prop="acWithstandCurrent" v-if="columns[10].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="反电势电压有效-1值" align="center" prop="bemf1Voltage" v-if="columns[11].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="反电势电压有效-2值" align="center" prop="bemf2Voltage" v-if="columns[12].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="反电势电压有效-3值" align="center" prop="bemf3Voltage" v-if="columns[13].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="反电动势-1常数" align="center" prop="bemf1Constant" v-if="columns[14].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="反电动势-2常数" align="center" prop="bemf2Constant" v-if="columns[15].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="反电动势-3常数" align="center" prop="bemf3Constant" v-if="columns[16].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="三相相位-1差" align="center" prop="bemf1Phase" v-if="columns[17].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="三相相位-2差" align="center" prop="bemf2Phase" v-if="columns[18].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="三相相位-3差" align="center" prop="bemf3Phase" v-if="columns[19].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="三相不平衡度" align="center" prop="bemfNobalance" v-if="columns[20].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="三相相序" align="center" prop="bemfPhaseSequence" v-if="columns[21].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="电压峰峰-1值" align="center" prop="peakValue1Voltage" v-if="columns[22].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="电压峰峰-2值" align="center" prop="peakValue2Voltage" v-if="columns[23].visible" :show-overflow-tooltip="true"/>
      <el-table-column label="电压峰峰-3值" align="center" prop="peakValue3Voltage" v-if="columns[24].visible" :show-overflow-tooltip="true"/>
      
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['monitor:aip:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['monitor:aip:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改数据查询对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="检测日期" prop="date">
              <el-date-picker clearable
                v-model="form.date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择检测日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检测开始时间" prop="startTime">
              <el-time-picker clearable
                v-model="form.startTime"
                type="time"
                value-format="HH:mm:ss"
                placeholder="请选择检测开始时间">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检测结束时间" prop="endTime">
              <el-time-picker clearable
                v-model="form.startTime"
                type="time"
                value-format="HH:mm:ss"
                placeholder="请选择检测结束时间">
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>  
        
        <el-row>
          <el-col :span="8">
            <el-form-item label="物料型号" prop="materialCode">
              <el-input v-model="form.materialCode" placeholder="请输入物料型号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料条码" prop="materialBarcode">
              <el-input v-model="form.materialBarcode" placeholder="请输入物料条码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否合格" prop="isPassed">
              <el-input v-model="form.isPassed" placeholder="请输入是否合格" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="绝缘项目-1值" prop="insulationResistance" :show-overflow-tooltip="true">
              <el-input v-model="form.insulationResistance" placeholder="请输入绝缘项目-1值" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交耐项目-1值" prop="acWithstandCurrent" :show-overflow-tooltip="true">
              <el-input v-model="form.acWithstandCurrent" placeholder="请输入交耐项目-1值" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="三相不平衡度" prop="bemfNobalance">
              <el-input v-model="form.bemfNobalance" placeholder="请输入三相不平衡度"  :show-overflow-tooltip="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="三相相序" prop="bemfPhaseSequence">
              <el-input v-model="form.bemfPhaseSequence" placeholder="请输入三相相序" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="电阻项目-1值" prop="resistance1Value" :show-overflow-tooltip="true">
              <el-input v-model="form.resistance1Value" placeholder="请输入电阻项目-1值" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电阻项目-2值" prop="resistance2Value" :show-overflow-tooltip="true">
              <el-input v-model="form.resistance2Value" placeholder="请输入电阻项目-2值" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电阻项目-3值" prop="resistance3Value" :show-overflow-tooltip="true">
              <el-input v-model="form.resistance3Value" placeholder="请输入电阻项目-3值" />
            </el-form-item>
          </el-col>
        </el-row>
      
        <el-row>
          <el-col :span="8">
            <el-form-item label="反电势电压有效-1值" prop="bemf1Voltage" :show-overflow-tooltip="true">
              <el-input v-model="form.bemf1Voltage" placeholder="请输入反电势电压有效-1值" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="反电势电压有效-2值" prop="bemf2Voltage" :show-overflow-tooltip="true">
              <el-input v-model="form.bemf2Voltage" placeholder="请输入反电势电压有效-2值" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="反电势电压有效-3值" prop="bemf3Voltage" :show-overflow-tooltip="true">
              <el-input v-model="form.bemf3Voltage" placeholder="请输入反电势电压有效-3值" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="反电动势-1常数" prop="bemf1Constant" :show-overflow-tooltip="true">
              <el-input v-model="form.bemf1Constant" placeholder="请输入反电动势-1常数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="反电动势-2常数" prop="bemf2Constant" :show-overflow-tooltip="true">
              <el-input v-model="form.bemf2Constant" placeholder="请输入反电动势-2常数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="反电动势-3常数" prop="bemf3Constant" :show-overflow-tooltip="true">
              <el-input v-model="form.bemf3Constant" placeholder="请输入反电动势-3常数" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="三相相位-1差" prop="bemf1Phase" :show-overflow-tooltip="true">
              <el-input v-model="form.bemf1Phase" placeholder="请输入三相相位-1差" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="三相相位-2差" prop="bemf2Phase" :show-overflow-tooltip="true">
              <el-input v-model="form.bemf2Phase" placeholder="请输入三相相位-2差" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="三相相位-3差" prop="bemf3Phase" :show-overflow-tooltip="true">
              <el-input v-model="form.bemf3Phase" placeholder="请输入三相相位-3差" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="电压峰峰-1值" prop="peakValue1Voltage" :show-overflow-tooltip="true">
              <el-input v-model="form.peakValue1Voltage" placeholder="请输入电压峰峰-1值" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电压峰峰-2值" prop="peakValue2Voltage" :show-overflow-tooltip="true">
              <el-input v-model="form.peakValue2Voltage" placeholder="请输入电压峰峰-2值" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电压峰峰-3值" prop="peakValue3Voltage">
              <!-- <el-input v-model="form.peakValue3Voltage" placeholder="请输入电压峰峰-3值" /> -->
              <el-tooltip class="item" effect="dark" :content="label" placement="top">
                <el-input v-model="form.peakValue3Voltage" placeholder="请输入电压峰峰-3值" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAip, getAip, delAip, addAip, updateAip } from "@/api/monitor/aip";

export default {
  name: "Aip",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 数据查询表格数据
      aipList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        date: null,
        materialCode: null,
        isPassed: null,
      },
      columns:[
        {key: 0, label: `检测日期`, visible:true},
        {key: 1, label: `检测开始时间`, visible:false},
        {key: 2, label: `检测结束时间`, visible:false},
        {key: 3, label: `物料型号`, visible:true},
        {key: 4, label: `物料条码`, visible:true},
        {key: 5, label: `是否合格`, visible:true},
        {key: 6, label: `电阻项目-1值`, visible:false},
        {key: 7, label: `电阻项目-2值`, visible:true},
        {key: 8, label: `电阻项目-3值`, visible:true},
        {key: 9, label: `绝缘项目-1值`, visible:true},
        {key: 10, label: `交耐项目-1值`, visible:true},
        {key: 11, label: `反电势电压有效-1值`, visible:true},
        {key: 12, label: `反电势电压有效-2值`, visible:false},
        {key: 13, label: `反电势电压有效-3值`, visible:false},
        {key: 14, label: `反电动势-1常数`, visible:true},
        {key: 15, label: `反电动势-2常数`, visible:false},
        {key: 16, label: `反电动势-3常数`, visible:false},
        {key: 17, label: `三相相位-1差`, visible:true},
        {key: 18, label: `三相相位-2差`, visible:false},
        {key: 19, label: `三相相位-3差`, visible:false},
        {key: 20, label: `三相不平衡度`, visible:true},
        {key: 21, label: `三相相序`, visible:true},
        {key: 22, label: `电压峰峰-1值`, visible:true},
        {key: 23, label: `电压峰峰-2值`, visible:false},
        {key: 24, label: `电压峰峰-3值`, visible:false},
        {key: 25, label: `物料编码`, visible:true}
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        startTime: [
          { required: true, message: "检测开始时间不能为空", trigger: "blur" }
        ],
        materialCode: [
          { required: true, message: "物料型号不能为空", trigger: "blur" }
        ],
        materialBarcode: [
          { required: true, message: "物料条码不能为空", trigger: "blur" }
        ],
      },
      queryParams: {
      isPassed: null,  // 用于保存实际查询参数，null 表示选择“全部”
      },
      inputIsPassed: null,  // 用于保存用户在下拉框中的选择
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询数据查询列表 */
    getList() {
      this.loading = true;
      listAip(this.queryParams).then(response => {
        this.aipList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        date: null,
        startTime: null,
        endTime: null,
        materialCode: null,
        materialBarcode: null,
        isPassed: null,
        resistance1Value: null,
        resistance2Value: null,
        resistance3Value: null,
        insulationResistance: null,
        acWithstandCurrent: null,
        bemf1Voltage: null,
        bemf2Voltage: null,
        bemf3Voltage: null,
        bemf1Constant: null,
        bemf2Constant: null,
        bemf3Constant: null,
        bemf1Phase: null,
        bemf2Phase: null,
        bemf3Phase: null,
        bemfNobalance: null,
        bemfPhaseSequence: null,
        peakValue1Voltage: null,
        peakValue2Voltage: null,
        peakValue3Voltage: null,
        materialId: null
      };
      this.resetForm("form");
    },
    handleInput(value) {
      // 根据输入的值判断是 "是" 还是 "否"，并转换为 1 或 0
      if (value === '是') {
        this.queryParams.isPassed = 1;
      } else if (value === '否') {
        this.queryParams.isPassed = 0;
      } else {
        this.queryParams.isPassed = value; // 其他情况可以保持原值
      }
    },
    handleSelectChange(value) {
      // 根据选择的值设置查询参数
      if (value === '0') {
        this.queryParams.isPassed = 0;  // "是" 时设置为 0
      } else if (value === '1') {
        this.queryParams.isPassed = 1;  // "否" 时设置为 1
      } else {
        this.queryParams.isPassed = null;  // "全部" 时查询所有（无筛选条件）
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.materialId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加数据查询";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const materialId = row.materialId || this.ids
      getAip(materialId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改数据查询";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.materialId != null) {
            updateAip(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAip(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const materialIds = row.materialId || this.ids;
      this.$modal.confirm('是否确认删除数据查询编号为"' + materialIds + '"的数据项？').then(function() {
        return delAip(materialIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('monitor/aip/export', {
        ...this.queryParams
      }, `aip_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
