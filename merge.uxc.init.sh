dir=$PWD; 

sh -c "cd $dir/docs/tools && sh generate_yuidoc_for_uxc.sh";

sleep 3s

echo "sleep done";

sh -c "cd $dir/uxc && node nodejs_merge.js";
sh -c "cd $dir/uxc/comps/Panel && node nodejs_merge.js";
sh -c "cd $dir/uxc/comps/Form && node nodejs_merge.js";

echo $dir;
