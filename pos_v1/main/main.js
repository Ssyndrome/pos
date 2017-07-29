'use strict';

function loadAllItems() {
  return [
    {
      barcode: 'ITEM000000',
      name: '可口可乐',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000002',
      name: '苹果',
      unit: '斤',
      price: 5.50
    },
    {
      barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15.00
    },
    {
      barcode: 'ITEM000004',
      name: '电池',
      unit: '个',
      price: 2.00
    },
    {
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50
    }
  ];
}

function loadPromotions() {
  return [
    {
      type: 'BUY_TWO_GET_ONE_FREE',
      barcodes: [
        'ITEM000000',
        'ITEM000001',
        'ITEM000005'
      ]
    }
  ];
}

function printReceipt(inputs){
	var barcode_list = get_barcode_list(inputs);
	var tag_list = get_tag_list(barcode_list);
	var print_list = get_print_list(tag_list);
	console.log(print_list);
}

function get_barcode_list(inputs){
	var NEW = {};
	inputs.forEach(function(val,index,inputs){
		if(NEW[val]){
			NEW[val]++;
		}else if(val.indexOf('-') != -1){
			if(NEW[val.split('-')[0]]){
				NEW[val.split('-')[0]] += parseFloat(val.split('-')[1]);
			}else{
				NEW[val.split('-')[0]] = parseFloat(val.split('-')[1]);
			}
		}else{
			NEW[val] = 1;
		}
	});
	return NEW;
}

function get_tag_list(barcode_list){
	var items = loadAllItems();
	var items_free = loadPromotions()[0].barcodes;
	var tag_list = [];
	items.forEach(function(val,index,items){
		if(barcode_list[val.barcode]){
			val.count = barcode_list[val.barcode];
			items_free.forEach(function(val_free){
				if(barcode_list[val_free]){
					val.free = Math.floor(val.count/3);
				}
			});
			tag_list.push(val);
		}
	});
	return tag_list;
}

function get_print_list(tag_list){
	var print_list = '***<没钱赚商店>收据***';
	var summary = 0;
	var summary_free = 0;
	tag_list.forEach(function(val){
		print_list += '\n'+ '名称：' +val.name+ '，数量：' +val.count+val.unit+ '，单价：' +val.price.toFixed(2)+ '(元)，小计：' +(val.price*(val.count-val.free)).toFixed(2)+'(元)';
		summary_free += val.free * val.price;
		summary += val.price*(val.count-val.free);
	});
	print_list += '\n'+'----------------------'+'\n'+ '总计：'+summary.toFixed(2)+ '(元)' +'\n'+ '节省：' +summary_free.toFixed(2)+'(元)'+'\n'+'**********************';
	return print_list;
}

