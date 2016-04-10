import React, { Component } from 'react';
import { shouldComponentUpdate } from 'react/lib/ReactComponentWithPureRenderMixin';

import FormAlert from '../../common/components/FormAlert';
import FormValidator from '../../common/units/FormValidator';
import { STATUS } from '../../common/constants/OrderStatus';

class ApproveQuery extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);

    this.state = {
      alert: null,
    }

    this.fv = new FormValidator(this, {
      start_date: {
        value: _Server_Data_.start_date ? _Server_Data_.start_date : '',
        validator: (value) => {
          if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '请输入开始日期';
          }
        }
      },
      end_date: {
        value: _Server_Data_.end_date ? _Server_Data_.end_date : '',
        validator: (value) => {
          if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return  '请输入结束日期';
          }
        }
      },
    });
  }
  
  handleChange (name, event) {
    this.fv.handleChange.call(this.fv, name, event);
  }

  onQeury(e) {
    e && e.preventDefault();

    if (this.fv.validateAll()) {
      let formData = this.fv.getFormData();

      this.setState({alert: null});
      this.setState({loading: true});

      this.props.onQeury(formData.start_date, formData.end_date, (success, data) => {
        this.setState({loading: false});
        if (success) {

        }else{
          this.setState({
            alert: { style: 'danger', text: data.message}
          });
        }
      });
    } else {
      this.setState({
        alert: { style: 'danger', text: this.fv.errorText}
      });
    }
  }

  onFilterClick(e) {
    let status = parseInt(this.refs.status.value);
    let perPage = parseInt(this.refs.perPage.value);
    let dept_id = parseInt(this.refs.dept_id.value);
    this.props.onFilter(status, perPage, dept_id);
  }

  getBsStyle (name) {
    if(!this.fv.getInputError(name)){
      return null;
    }else{
      return 'has-error';
    }
  }

  render() {
    let { depts, deptList } = this.props;
    return (
      <form onSubmit={this.onQeury.bind(this)} >
        <div className="row">
          <div className={'form-group col-sm-6 col-md-4 '+this.getBsStyle.call(this, 'start_date')}>
            <label className="control-label inline-label">开始日期</label>
            <div className="input-group">
              <input type="date" placeholder="开始日期" className="form-control" onChange={this.handleChange.bind(this, 'start_date')} value={this.fv.getInputValue('start_date')} />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className={'form-group col-sm-6 col-md-4 '+this.getBsStyle.call(this, 'end_date')}>
            <label className="control-label inline-label">结束日期</label>
            <div className="input-group">
              <input type="date" placeholder="结束日期" className="form-control" onChange={this.handleChange.bind(this, 'end_date')} value={this.fv.getInputValue('end_date')} />
              <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <button type="submit" className="btn-block btn btn-primary" disabled={this.state.loading}>查找</button>
          </div>
          <div className="col-md-12">
            {this.state.alert?(<FormAlert style={this.state.alert.style} text={this.state.alert.text}/>):null}
          </div>
          <div className="col-sm-12">
            <hr className="small" />
          </div> 
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">预约状态</label>
            <div className="inline-control">
              <select ref="status" className="form-control" defaultValue="1">
                <option value={STATUS.STATUS_PENDING}>待审批预约</option>
                <option value={STATUS.STATUS_APPROVED}>已通过预约</option>
                <option value={STATUS.STATUS_REJECTED}>已驳回预约</option>
                <option value="0">全部</option>
              </select>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">社团单位</label>
            <div className="inline-control">
              <select ref="dept_id" className="form-control" defaultValue="0">
                <option value="0">全部</option>
                {
                  deptList && deptList.map(dept_id => {
                    let dept = depts[dept_id];
                    return (
                      <option key={dept_id} value={dept_id}>{dept.name}</option>
                    );
                  })
                }
              </select>
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label className="control-label inline-label">每页显示</label>
            <div className="inline-control">
              <input ref="perPage" type="text" placeholder="每页显示" className="form-control" defaultValue="8" />
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <button type="button" className="btn-block btn btn-success" onClick={this.onFilterClick.bind(this)}>筛选</button>
          </div>
        </div>
      </form>
    );
  }
}

export default ApproveQuery;