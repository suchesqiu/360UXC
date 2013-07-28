dir=$PWD; 

sh -c "cd $dir/tools && sh generate_yuidoc_for_uxc.sh";

sleep 3s

echo "sleep done";

sh -c "node nodejs_merge.js";
sh -c "cd $dir/comps/Calendar && node nodejs_merge.js";
sh -c "cd $dir/comps/Panel && node nodejs_merge.js";
sh -c "cd $dir/comps/Form && node nodejs_merge.js";
sh -c "cd $dir/comps/LunarCalendar && node nodejs_merge.js";

echo $dir;
